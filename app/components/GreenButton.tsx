import React from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'

interface GreenButton {
  onPress: () => void
  text: string
}

const GreenButton: React.FC<GreenButton> = ({onPress, text}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

export default GreenButton

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#24988D',
    borderRadius: 15,
    justifyContent: 'center',
    marginLeft: '3%',
    minHeight: 45,
    width: '36%'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14
  }
})
