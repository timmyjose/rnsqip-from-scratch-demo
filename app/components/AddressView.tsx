import React from 'react'
import {Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

AddressView.propTypes = {
  address: PropTypes.string.isRequired,
}

export default function AddressView({address}: {address: string}) {
  return <Text style={styles.address}>{address}</Text>
}

const styles = StyleSheet.create({
  address: {
    color: '#7B7B7B',
    fontSize: 15,
    marginTop: 4,
  },
})
