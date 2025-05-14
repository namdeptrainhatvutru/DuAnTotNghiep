import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/actions/UserAction';

const AddStaff = ({ navigation }) => {
  const dispatch = useDispatch();
  const [ho_ten, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [mat_khau, setMatKhau] = useState('');
  const [so_dien_thoai, setSoDienThoai] = useState('');
  const [gioi_tinh, setGioi_tinh] = useState('');
  const [ngay_sinh, setNgay_sinh] = useState('');

  const handleAddStaff = async () => {
    if (!ho_ten || !email || !mat_khau || !so_dien_thoai) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    const user = {
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
      ngay_sinh,
      gioi_tinh,
      vai_tro: 2, // Nhân viên
      diem: 0,
    };
    try {
      const resultAction = await dispatch(addUser(user));
      if (addUser.fulfilled.match(resultAction)) {
        Alert.alert('Thành công', 'Thêm nhân viên thành công!');
        navigation.goBack && navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Thêm nhân viên thất bại!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm nhân viên</Text>
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
      <TouchableOpacity
        onPress={handleAddStaff}
        style={styles.button}
      >
        <Text style={{ color: 'white' }}>Thêm nhân viên</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff'
  },
  title: {
    fontSize: 24, fontWeight: 'bold', margin: 24,
  },
  input: {
    width: 350, height: 48, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, paddingHorizontal: 12, fontSize: 16,
  },
  button: {
    backgroundColor: '#BB0000', width: 200, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 50, marginTop: 20,
  }
});