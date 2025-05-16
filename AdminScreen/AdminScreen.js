import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const AdminScreen = () => {
    const nav = useNavigation()
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center',padding:10}}>
      {/* <Button title="thêm nhân viên" onPress={()=>{nav.navigate('AddStaff')}}/>
      <Button title="Quản lý rạp chiếu" onPress={()=>{nav.navigate('QuanLyRapChieu')}}/>
      <Button title="Quản lý voucher" onPress={()=>{nav.navigate('QuanLyVoucher')}}/>
      <Button title="Quản lý khách hàng" onPress={()=>{nav.navigate('QuanLyKhachHang')}}/> */}
      <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%',marginBottom:20}}>
      <TouchableOpacity style={{backgroundColor:'white', width:200, height:200, justifyContent:'center', alignItems:'center', borderRadius:10,alignContent:'center',padding:10}} onPress={()=>{nav.navigate('AddStaff')}}>
        <Image source={require('../img/quanlyStaff.png')} style={{width:100,height:100}}/>
        <Text>Quản lý nhân viên</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:'white', width:200, height:200, justifyContent:'center', alignItems:'center', borderRadius:10,alignContent:'center',padding:10}} onPress={()=>{nav.navigate('QuanLyRapChieu')}}>
        <Image source={require('../img/quanlycinema.png')} style={{width:100,height:100}}/>
        <Text>Quản lý Rạp chiếu</Text>
      </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%',marginBottom:20}}>
      <TouchableOpacity style={{backgroundColor:'white', width:200, height:200, justifyContent:'center', alignItems:'center', borderRadius:10,alignContent:'center',padding:10}} onPress={()=>{nav.navigate('QuanLyVoucher')}}>
        <Image source={require('../img/voucher.png')} style={{width:100,height:100}}/>
        <Text>Quản lý voucher</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:'white', width:200, height:200, justifyContent:'center', alignItems:'center', borderRadius:10,alignContent:'center',padding:10}} onPress={()=>{nav.navigate('QuanLyKhachHang')}}>
        <Image source={require('../img/users.png')} style={{width:100,height:100}}/>
        <Text>Quản lý khách hàng</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default AdminScreen

const styles = StyleSheet.create({})