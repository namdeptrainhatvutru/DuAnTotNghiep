import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PhongChieu = ({route}) => {
  const { cinema_id,ten_rap } = route.params;
  return (
    <View>
      <Text>{ten_rap}</Text>
      
    </View>
  )
}

export default PhongChieu

const styles = StyleSheet.create({})