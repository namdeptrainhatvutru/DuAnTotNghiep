import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {updateUser} from '../redux/actions/UserAction';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [hoTen, setHoTen] = React.useState(user.ho_ten || '');
  const [email, setEmail] = React.useState(user.email || '');
  const [soDienThoai, setSoDienThoai] = React.useState(user.so_dien_thoai || '');
  const [ngaySinh, setNgaySinh] = React.useState(user.ngay_sinh || '');
  const [gioiTinh, setGioiTinh] = React.useState(user.gioi_tinh?.toString() || '');

  const openModal = () => {
    setHoTen(user.ho_ten || '');
    setEmail(user.email || '');
    setSoDienThoai(user.so_dien_thoai || '');
    setNgaySinh(user.ngay_sinh || '');
    setGioiTinh(user.gioi_tinh?.toString() || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      ho_ten: hoTen,
      email,
      so_dien_thoai: soDienThoai,
      ngay_sinh: ngaySinh,
      gioi_tinh: gioiTinh,
    };
    await dispatch(updateUser(updatedUser));
    setModalVisible(false);
  };

  return (
    <View style={styles.khung}>
      <View>
        <Image
          style={{width: 150, height: 150, margin: 10}}
          source={require('../img/profile.png')}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.hoten}>{user.ho_ten}</Text>
        <Text style={{marginBottom: 10}}>Thẻ thành viên</Text>
        <Image source={require('../img/thanhvien.png')} />
        <View style={styles.divider} />
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.label}>Tổng chỉ tiêu</Text>
            <Text>0đ</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={{alignItems: 'center'}}>
            <Text style={styles.label}>Điểm thưởng</Text>
            <Text>{user.diem}</Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          })
        }
        style={styles.logoutBtn}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Đăng xuất</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editBtn} onPress={openModal}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Sửa</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Cập nhật thông tin</Text>

              <Text style={styles.inputLabel}>Họ tên</Text>
              <TextInput style={styles.input} value={hoTen} onChangeText={setHoTen} />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput disable={true} style={styles.input} value={email} onChangeText={setEmail} />

              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={soDienThoai}
                onChangeText={setSoDienThoai}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Ngày sinh (dd/mm/yyyy)</Text>
              <TextInput style={styles.input} value={ngaySinh} onChangeText={setNgaySinh} />

              <Text style={styles.inputLabel}>Giới tính (1: Nam, 2: Nữ)</Text>
              <TextInput
                style={styles.input}
                value={gioiTinh}
                onChangeText={setGioiTinh}
                keyboardType="numeric"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.btnLuu} onPress={handleSave}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnHuy}
                  onPress={() => setModalVisible(false)}>
                  <Text style={{color: '#333'}}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  khung: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    backgroundColor: 'white',
    height: 500,
    width: '100%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  hoten: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: '100%',
    marginVertical: 14,
  },
  verticalDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'gray',
  },
  logoutBtn: {
    justifyContent: 'center',
    backgroundColor: '#E28F1B',
    marginTop: 20,
    width: '100%',
    height: 60,
    alignItems: 'center',
    borderRadius: 10,
  },
  editBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#EA5A5A',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '85%',
    elevation: 6,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EA5A5A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  btnLuu: {
    backgroundColor: '#EA5A5A',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  btnHuy: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
});
