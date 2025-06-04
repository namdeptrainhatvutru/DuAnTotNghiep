import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Button, Modal, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSuatChieu } from '../redux/actions/SuatChieuAction'

const CapNhatSuatChieu = ({ route, navigation }) => {
  const { phim, suat_chieu } = route.params
  console.log('suat_chieu:', suat_chieu);
  
  const dispatch = useDispatch()
  const listphim = useSelector(state => state.phim.listphim)

  // State cho các trường chỉnh sửa
    const [ngay_chieu, setngay_chieu] = useState(suat_chieu.ngay_chieu.toString())
    const [thoi_gian_bat_dau, setthoi_gian_bat_dau] = useState(suat_chieu.thoi_gian_bat_dau.toString())
    const [thoi_gian_ket_thuc, setthoi_gian_ket_thuc] = useState(suat_chieu.thoi_gian_ket_thuc.toString())
    const [phim_id, setphim_id] = useState(suat_chieu.phim_id)
    const [phimModal, setPhimModal] = useState(false)

  const handleUpdate = () => {
    const updated = {
      ...suat_chieu,
      ngay_chieu,
      thoi_gian_bat_dau,
      thoi_gian_ket_thuc,
      phim_id,
    }
    dispatch(updateSuatChieu(updated)).then(() => {
      Alert.alert('Cập nhật thành công!')
      navigation.goBack()
    })
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Cập nhật suất chiếu</Text>
      <TextInput
        placeholder="Ngày chiếu"
        value={ngay_chieu}
        onChangeText={setngay_chieu}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Thời gian bắt đầu"
        value={thoi_gian_bat_dau}
        onChangeText={setthoi_gian_bat_dau}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Thời gian kết thúc"
        value={thoi_gian_ket_thuc}
        onChangeText={setthoi_gian_ket_thuc}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 8 }}
      />
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          alignItems: 'center',
          backgroundColor: '#eee',
        }}
        onPress={() => setPhimModal(true)}
      >
        <Text>
          {phim_id
            ? (listphim.find(p => p.phim_id === phim_id)?.ten_phim || 'Chọn phim')
            : 'Chọn phim'}
        </Text>
      </TouchableOpacity>
      <Button title="Lưu" onPress={handleUpdate} />
      <Button title="Quay lại" onPress={() => navigation.goBack()} />

      {/* Modal chọn phim */}
      <Modal visible={phimModal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              width: 320,
              maxHeight: 400,
            }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Chọn phim</Text>
            <ScrollView horizontal={false}>
              {listphim.map(item => (
                <TouchableOpacity
                  key={item.phim_id}
                  onPress={() => {
                    setphim_id(item.phim_id)
                    setPhimModal(false)
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor: phim_id === item.phim_id ? '#d0ebff' : '#fff',
                  }}>
                  <Image
                    source={{ uri: item.poster_url }}
                    style={{
                      width: 50,
                      height: 75,
                      borderRadius: 4,
                      marginRight: 10,
                    }}
                  />
                  <Text>{item.ten_phim}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Đóng" onPress={() => setPhimModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CapNhatSuatChieu

const styles = StyleSheet.create({})