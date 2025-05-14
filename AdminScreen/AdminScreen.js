import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const AdminScreen = () => {
    const nav = useNavigation()
  return (
    <View>
      <Button title="thêm nhân viên" onPress={()=>{nav.navigate('AddStaff')}}/>
      <Button title="Quản lý rạp chiếu" onPress={()=>{nav.navigate('QuanLyRapChieu')}}/>
      <Button title="Quản lý voucher" onPress={()=>{nav.navigate('QuanLyVoucher')}}/>
    </View>
  )
}

export default AdminScreen

const styles = StyleSheet.create({})