import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const DifferentScreen = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Text>DifferentScreen</Text>

      <TouchableOpacity onPress={()=>{navigation.navigate('KhoVe')}}>
        <Text>Kho vé của bạn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('KhoVoucher')}}>
        <Text>Kho voucher của bạn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('Chatbot')}}>
        <Text>Chat bot</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DifferentScreen

const styles = StyleSheet.create({})