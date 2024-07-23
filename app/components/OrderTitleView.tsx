import React from 'react'
import { Text, View, StyleSheet, TouchableHighlight, Image } from 'react-native'
import PropTypes from 'prop-types'

const closeButton = require('../images/btnClose.png')

OrderTitleView.propTypes = {
  onCloseOrderScreen: PropTypes.func.isRequired,
}

export default function OrderTitleView({
  onCloseOrderScreen,
}: {
  onCloseOrderScreen: () => void
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place your order</Text>
      <TouchableHighlight
        style={styles.closeButton}
        underlayColor="#FFFFFF"
        onPress={() => onCloseOrderScreen()}>
        <Image source={closeButton} />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  closeButton: {
  },
  container: {
    width: '185%',
    backgroundColor: '#24988D',
    alignItems :'center',
    justifyContent :'center',
    flexDirection: 'row',
    marginBottom : '2%'
  },
  title: {
    position :'absolute',
    color: '#ffffff',
    fontSize: 18,
    fontWeight :'bold',
    textAlign: 'center'
  }
})
