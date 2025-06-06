import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const DifferentScreen = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Text>DifferentScreen</Text>

      <TouchableOpacity onPress={()=>{navigation.navigate('VeCuaBan')}}>
        <Text>vé của bạn</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DifferentScreen

const styles = StyleSheet.create({})