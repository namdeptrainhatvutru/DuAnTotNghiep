import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addUser } from '../redux/actions/UserAction'

const Register = ({ navigation }) => {
  const dispatch = useDispatch()
  const [ho_ten, setHoTen] = useState('')
  const [email, setEmail] = useState('')
  const [mat_khau, setMatKhau] = useState('')
  const [mat_khau2, setMatKhau2] = useState('')
  const [so_dien_thoai, setSoDienThoai] = useState('')
  const [gioi_tinh, setGioi_tinh] = useState('')
  const [ngay_sinh, setNgay_sinh] = useState('')

  const handleRegister = async () => {
    if (!ho_ten || !email || !mat_khau || !so_dien_thoai) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!')
      return
    }
    if (mat_khau !== mat_khau2) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp!')
      return
    }
    const user = {
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
      ngay_sinh,
      gioi_tinh,
      vai_tro: 1,
      diem: 0,
    }
    try {
      const resultAction = await dispatch(addUser(user))
      if (addUser.fulfilled.match(resultAction)) {
        Alert.alert('Thành công', 'Đăng ký thành công!')
        navigation.goBack()
      } else {
        Alert.alert('Lỗi', 'Đăng ký thất bại!')
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra!')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ tên"
        value={ho_ten}
        onChangeText={setHoTen}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={mat_khau}
        onChangeText={setMatKhau}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        value={mat_khau2}
        onChangeText={setMatKhau2}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={so_dien_thoai}
        onChangeText={setSoDienThoai}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày sinh"
        value={ngay_sinh}
        onChangeText={setNgay_sinh}
      
      />
      <TextInput
        style={styles.input}
        placeholder="Giới tính"
        value={gioi_tinh}
        onChangeText={setGioi_tinh}
        
      />
      <Button title="Đăng ký" onPress={()=>{handleRegister()}} />
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
})