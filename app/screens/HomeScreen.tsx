import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import Modal from 'react-native-modal'
import OrderModal from '../components/OrderModal'
import PendingModal from '../components/PendingModal'
import GreenButton from '../components/GreenButton'
import {
  SQUARE_APP_ID,
  CHARGE_SERVER_HOST,
  GOOGLE_PAY_LOCATION_ID,
  APPLE_PAY_MERCHANT_ID
} from '../Constants'
import { printCurlCommand } from '../Utilities'
import CommonAlert from '../components/CommonAlert'
import { SQIPApplePay, SQIPCore, SQIPGooglePay } from "react-native-square-in-app-payments"
import chargeCardNonce from '../service/Charge'

const applePayStatus = {
  none: 0,
  succeeded: 1,
  nonceNotCharged: 2,
}

interface ErrorInfo {
  message: string
}

let errorMsg = null

export default function HomeScreen() {
  const [showingBottomSheet, setshowingBottomSheet] = useState(false)
  const [showingPendingScreen, setshowingPendingScreen] = useState(false)
  const [showingDigitalWallet, setshowingDigitalWallet] = useState(false)
  const [canUseDigitalWallet, setcanUseDigitalWallet] = useState(false)
  const [applePayState, setapplePayState] = useState(applePayStatus.none)
  const [applePayError, setapplePayError] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(false)
  const [showingDialogSheet, setshowingDialogSheet] = useState(false)

  useEffect(() => {
    initState()
  })

  interface CardDetails {
    nonce: string
    card: {
      prepaidType: string,
      expirationYear: number,
      brand: string,
      postalCode: string,
      expirationMonth: number,
      type: string,
      lastFourDigits: string
    }
  }

  const initState = async () => {
    await SQIPCore.setSquareApplicationId(SQUARE_APP_ID)
    let digitalWalletEnabled = false
    if (Platform.OS === 'ios') {
      try {
        await SQIPApplePay.initializeApplePay(APPLE_PAY_MERCHANT_ID)
        digitalWalletEnabled = await SQIPApplePay.canUseApplePay()
      } catch (ex) {
        console.error(ex)
      }
    } else if (Platform.OS === 'android') {
      await SQIPGooglePay.initializeGooglePay(
        GOOGLE_PAY_LOCATION_ID,
        SQIPGooglePay.EnvironmentTest,
      )
      try {
        digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay()
      } catch (ex) {
        console.error(ex)
      }
    }
    setcanUseDigitalWallet(digitalWalletEnabled)
  }

  const onApplePayRequestNonceSuccess = async (cardDetails: CardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce)
        await SQIPApplePay.completeApplePayAuthorization(true)
        setapplePayState(applePayStatus.succeeded)
      } catch (error: any) {
        await SQIPApplePay.completeApplePayAuthorization(false, error.message)
        setapplePayError(error.message)
      }
    } else {
      await SQIPApplePay.completeApplePayAuthorization(true)
      setapplePayState(applePayStatus.nonceNotCharged)
      printCurlCommand(cardDetails.nonce, SQUARE_APP_ID)
    }
  }

  const onApplePayRequestNonceFailure = async (errorInfo: ErrorInfo) => {
    console.error('request failed: ', errorInfo)
    errorMsg = errorInfo.message
    await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message)
    setAlertValue('Error processing Apple Pay payment', errorMsg, false)
  }

  const onApplePayComplete = async () => {
    if (applePayState === applePayStatus.succeeded) {
      setAlertValue(
        'Congratulations, Your order was successful',
        'Go to your Square dashboard to see this order reflected in the sales tab.',
        true
      )
    } else if (applePayState === applePayStatus.nonceNotCharged) {
      setAlertValue(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        true
      )
    } else if (applePayError != null) {
      setAlertValue('Error processing Apple Pay payment', applePayError, false)
    } else {
      // the state is none, so they canceled
      showOrderScreen()
    }
  }

  const onGooglePayRequestNonceSuccess = async (cardDetails: CardDetails) => {
    if (chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce)
        setAlertValue(
          'Congratulations, Your order was successful',
          'Go to your Square dashbord to see this order reflected in the sales tab.',
          true
        )
      } catch (error: any) {
        setAlertValue('Error processing GooglePay payment', error.message, false)
      }
    } else {
      printCurlCommand(cardDetails.nonce, SQUARE_APP_ID)
      setAlertValue(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        true
      )
    }
  }

  const onGooglePayRequestNonceFailure = (errorInfo: any) => {
    setAlertValue('Could not create GooglePay nonce', errorInfo, false)
  }

  const onGooglePayCanceled = () => {
    showOrderScreen()
  }

  const onShowDigitalWallet = () => {
    closeOrderScreen()
    setshowingDigitalWallet(true)
  }

  const showOrderScreen = () => {
    setshowingBottomSheet(true)
    setshowingPendingScreen(false)
  }

  const closeOrderScreen = () => {
    setshowingBottomSheet(false)
  }

  const chargeServerHostIsSet = () => {
    return CHARGE_SERVER_HOST
  }

  const googlePayLocationIsSet = () => {
    return GOOGLE_PAY_LOCATION_ID !== 'REPLACE_ME'
  }

  const applePayMerchantIsSet = () => {
    return APPLE_PAY_MERCHANT_ID !== 'REPLACE_ME'
  }

  const checkStateAndPerform = async () => {
    if (showingDigitalWallet) {
      startDigitalWallet()
      setshowingDigitalWallet(false)
    }
  }

  const startDigitalWallet = async () => {
    if (Platform.OS === 'ios' && canUseDigitalWallet) {
      if (!applePayMerchantIsSet()) {
        setAlertValue(
          'Missing Apple Merchant ID',
          'To request an Apple Pay nonce, replace APPLE_PAY_MERCHANT_ID' +
          ' in Constants.js with an Apple Merchant ID.',
          false
        )
      } else {
        console.log('In startDIgitalWallet, about to call requestApplePayNonce')
        await SQIPApplePay.requestApplePayNonce(
          {
            price: '1.00',
            summaryLabel: 'Test Item',
            countryCode: 'US',
            currencyCode: 'USD',
            paymentType: SQIPApplePay.PaymentTypeFinal,
          },
          onApplePayRequestNonceSuccess,
          onApplePayRequestNonceFailure,
          onApplePayComplete,
        )
      }
    } else if (Platform.OS === 'android') {
      if (!googlePayLocationIsSet()) {
        setAlertValue(
          'Missing GooglePay Location ID',
          'To request a GooglePay nonce, replace GOOGLE_PAY_LOCATION_ID' +
          ' in Constants.js with an Square Location ID.',
          false
        )
      } else {
        await SQIPGooglePay.requestGooglePayNonce(
          {
            price: '1.00',
            currencyCode: 'USD',
            priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
          },
          onGooglePayRequestNonceSuccess,
          onGooglePayRequestNonceFailure,
          onGooglePayCanceled,
        )
      }
    }
  }

  const renderModal = () => {
    if (showingPendingScreen) {
      return <PendingModal />
    } else {
      return (
        <OrderModal
          onCloseOrderScreen={() => closeOrderScreen()}
          onShowDigitalWallet={() => onShowDigitalWallet()}
        />
      )
    }
  }

  const showCommonAlert = (title: string, description: string) => {
    return (
      <CommonAlert title={title} description={description} status={status} isVisible={showingDialogSheet} onDialogClick={onDialogClick} />
    )
  }

  const setAlertValue = (title, description, status) => {
    setshowingDialogSheet(true)
    setTitle(title)
    setDescription(description)
    setStatus(status)
  }

  const onDialogClick = () => {
    setshowingDialogSheet(false)
  }

  return (
    <View style={styles.container}>
      <Image source={require('../images/iconCookie.png')} />
      <Text style={styles.title}>Super Cookie</Text>
      <Text style={styles.description}>
        Instantly gain special powers when ordering a super cookie
      </Text>
      <GreenButton onPress={() => { setshowingBottomSheet(true) }} text="Buy" />
      {showCommonAlert(title, description)}
      <Modal
        isVisible={showingBottomSheet}
        style={styles.bottomModal}
        onBackdropPress={closeOrderScreen}
        // set timeout due to iOS needing to make sure modal is closed
        // before presenting another view
        onModalHide={() => setTimeout(() => checkStateAndPerform(), 200)}>
        <View style={styles.modalContent}>{renderModal()}</View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#78CCC5',
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
    textAlign: 'center',
  },
  modalContent: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0,
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28
  }
})
