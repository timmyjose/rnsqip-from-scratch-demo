import React from 'react'
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import PropTypes from 'prop-types'

const googlePayLogo = require('../images/applePayLogo.png')
const applePayLogo = require('../images/googlePayLogo.png')

DigitalWalletButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export default function DigitalWalletButton({ onPress }: { onPress: () => void }) {
  const imageSource = Platform.OS === 'ios' ? googlePayLogo : applePayLogo
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.button}>
      <Image
        source={imageSource} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 15,
    justifyContent: 'center',
    marginLeft: '3%',
    minHeight: 45,
    width: '36%'
  }
})
