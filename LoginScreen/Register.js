import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {CheckBox} from 'react-native-elements/dist/checkbox/CheckBox';
import { useDispatch } from 'react-redux'
import { addUser } from '../redux/actions/UserAction'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const Register = ({ navigation }) => {
  const dispatch = useDispatch()
  const [ho_ten, setHoTen] = useState('')
  const [email, setEmail] = useState('')
  const [mat_khau, setMatKhau] = useState('')
  const [mat_khau2, setMatKhau2] = useState('')
  const [so_dien_thoai, setSoDienThoai] = useState('')
  const [gioi_tinh, setGioi_tinh] = useState('')
  const [ngay_sinh, setNgay_sinh] = useState('')
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleRegister = async () => {
    if (!ho_ten || !email || !mat_khau || !so_dien_thoai) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!')
      return
    }
    if (mat_khau !== mat_khau2) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp!')
      return
    }
    if (!checked) {
      Alert.alert('Lỗi', 'Bạn phải đồng ý với chính sách bảo mật và điều khoản sử dụng!');
      return;
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
      <Text style={{ alignSelf: 'flex-start', marginLeft: 10, color: 'red' }}>*Thông tin bắt buộc</Text>

      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="user" size={24} color="#666" />
        <TextInput
          style={{ marginLeft: 10, flex: 1 }}
          placeholder="Họ tên"
          value={ho_ten}
          onChangeText={setHoTen}
        />
      </View>
      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="envelope" size={24} color="#666" />
        <TextInput
          style={{ marginLeft: 10, flex: 1 }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="lock" size={24} color="#666" />
        <TextInput
          style={{ marginLeft: 10, flex: 1 }}
          placeholder="Mật khẩu"
          value={mat_khau}
          onChangeText={setMatKhau}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye' : 'eye-slash'}
            size={22}
            color="#666"
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="lock" size={24} color="#666" />
        <TextInput
          style={{ marginLeft: 10, flex: 1 }}
          placeholder="Nhập lại mật khẩu"
          value={mat_khau2}
          onChangeText={setMatKhau2}
          secureTextEntry={!showPassword2}
        />
        <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
          <Icon
            name={showPassword2 ? 'eye' : 'eye-slash'}
            size={22}
            color="#666"
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="phone" size={24} color="#666" />
        <TextInput
          style={{ marginLeft: 10, flex: 1 }}
          placeholder="Số điện thoại"
          value={so_dien_thoai}
          onChangeText={setSoDienThoai}
          keyboardType="phone-pad"
        />
      </View>
      <Text style={{ alignSelf: 'flex-start', marginLeft: 10, color: 'blue',fontSize:10 }}>Thông tin bổ sung</Text>
      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="calendar" size={24} color="#666" />
        <TextInput
          style={{ marginLeft: 10, flex: 1 }}
          placeholder="Ngày sinh"
          value={ngay_sinh}
          onChangeText={setNgay_sinh}
        />
      </View>
      <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
        <Icon name="venus-mars" size={24} color="#666" />
        <Picker
          selectedValue={gioi_tinh}
          style={{ marginLeft: 10, flex: 1, height: 50 }}
          onValueChange={(itemValue) => setGioi_tinh(itemValue)}
        >
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
        </Picker>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, alignSelf: 'flex-start' }}>
        <CheckBox
          checked={checked}
          onPress={() => setChecked(!checked)}
        />
        <Text style={{ marginRight:40 }}>Tôi cam kết tuân theo chính sách bảo mật và điều khoản sử dụng của Movix</Text>
      </View>
      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: checked ? '#BB0000' : '#ccc',
          width: '85%',
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
          marginTop: 20,
        }}
        disabled={!checked}
      >
        <Text style={{ color: 'white' }}>Đăng ký</Text>
      </TouchableOpacity>
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
    margin: 24,
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
   textInput: {
    width: 450,
    height: 65,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
  },
})