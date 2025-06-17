import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
const VeCuaBan = ({route}) => {
  const {thongTinVe,qrData} = route.params
  
  const navigation = useNavigation();
  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MyTabs' }], 
    });
  };
  return (
  <View>
      
      <Text style={{fontWeight: 'bold', fontSize: 18}}>Thông tin vé</Text>
            <Text>Tên phim: {thongTinVe.ten_phim}</Text>
            <Text>Ngày chiếu: {thongTinVe.ngay_chieu}</Text>
            <Text>Giờ chiếu: {thongTinVe.gio_chieu}</Text>
            <Text>Phòng chiếu: {thongTinVe.ten_phong}</Text>
            <Text>Rạp: {thongTinVe.dia_chi_rap}</Text>
            <Text>Số ghế: {thongTinVe.vi_tri_ghe}</Text>
            <View style={{alignItems: 'center', marginVertical: 20}}>
        <QRCode value={qrData} size={200} />
      </View> 
      <Text>Vui lòng lưu lại mã qr của bạn</Text>
      <Button title='Quay về home' onPress={handleBackToHome} />
    </View>
  )
}

export default VeCuaBan

const styles = StyleSheet.create({})