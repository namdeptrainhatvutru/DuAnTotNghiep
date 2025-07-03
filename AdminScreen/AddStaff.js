import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Alert, FlatList, ScrollView, Image, Modal,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/actions/UserAction';

const AddStaff = () => {
  const dispatch = useDispatch();
  const [ho_ten, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [mat_khau, setMatKhau] = useState('');
  const [so_dien_thoai, setSoDienThoai] = useState('');
  const [gioi_tinh, setGioi_tinh] = useState('');
  const [ngay_sinh, setNgay_sinh] = useState('');
  const [staff, setStaff] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    ho_ten: '',
    email: '',
    mat_khau: '',
    so_dien_thoai: '',
    gioi_tinh: '',
    ngay_sinh: ''
  });

  const getListStaff = async () => {
    const res = await fetch('https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang?vai_tro=2');
    const data = await res.json();
    setStaff(data);
  };

  useEffect(() => {
    getListStaff();
  }, []);

  const resetForm = () => {
    setHoTen('');
    setEmail('');
    setMatKhau('');
    setSoDienThoai('');
    setNgay_sinh('');
    setGioi_tinh('');
  };

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
      vai_tro: 2,
      diem: 0,
    };
    try {
      const resultAction = await dispatch(addUser(user));
      if (addUser.fulfilled.match(resultAction)) {
        Alert.alert('Thành công', 'Thêm nhân viên thành công!');
        resetForm();
        setAddModalVisible(false);
        getListStaff();
      } else {
        Alert.alert('Lỗi', 'Thêm nhân viên thất bại!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.khach_hang_id);
    setEditData({
      ho_ten: item.ho_ten,
      email: item.email,
      mat_khau: item.mat_khau,
      so_dien_thoai: item.so_dien_thoai,
      ngay_sinh: item.ngay_sinh,
      gioi_tinh: item.gioi_tinh,
    });
    setEditModalVisible(true);
  };

  const handleUpdateStaff = async () => {
    const { ho_ten, email, mat_khau, so_dien_thoai, ngay_sinh, gioi_tinh } = editData;
    if (!ho_ten || !email || !mat_khau || !so_dien_thoai) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      await fetch(`https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ho_ten,
          email,
          mat_khau,
          so_dien_thoai,
          ngay_sinh,
          gioi_tinh,
          vai_tro: 2,
          diem: 0,
        }),
      });
      Alert.alert('Cập nhật thành công!');
      setEditModalVisible(false);
      getListStaff();
    } catch (error) {
      Alert.alert('Lỗi', 'Không cập nhật được!');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa nhân viên này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang/${id}`, {
                method: 'DELETE'
              });
              if (res.ok) {
                getListStaff();
                Alert.alert('Đã xóa nhân viên!');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không xóa được!');
            }
          }
        }
      ]
    );
  };
const search = staff.filter((item)=>item.ho_ten?.toLowerCase().includes(searchText.toLowerCase()) )

  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <Image style={styles.avatar} source={require('../img/staff.png')} />
    <View style={{ flex: 1, marginLeft: 16 }}>
      <Text style={styles.cardTitle}>{item.ho_ten}</Text>
      <Text style={styles.cardText}>Email: {item.email}</Text>
      <Text style={styles.cardText}>SĐT: {item.so_dien_thoai}</Text>
      <Text style={styles.cardText}>Ngày sinh: {item.ngay_sinh}</Text>
      <Text style={styles.cardText}>Giới tính: {item.gioi_tinh}</Text>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TouchableOpacity
          style={[styles.cardBtn, { backgroundColor: '#2a9d8f', marginRight: 10 }]}
          onPress={() => handleEdit(item)}
        >
          <Text style={{ color: 'white' }}>Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cardBtn, { backgroundColor: '#f55' }]}
          onPress={() => handleDelete(item.khach_hang_id)}
        >
          <Text style={{ color: 'white' }}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
  if (staff.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' color="#BB0000"/>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#BB0000' }}>
          Danh sách nhân viên
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 18,
        marginBottom: 8,
        borderRadius: 12,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
      }}>
        <Image  style={{ width: 22, height: 22, marginRight: 8, tintColor: '#888' }} />
        <TextInput
          style={{ flex: 1, fontSize: 16 }}
          value={searchText}
          onChangeText={setSearchText}
          placeholder='Tìm kiếm theo tên nhân viên...'
          placeholderTextColor="#aaa"
        />
      </View>

      {staff.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color="#BB0000" />
        </View>
      ) : (
        <FlatList
          data={search}
          keyExtractor={item => item.khach_hang_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Nút dấu + mở modal thêm */}
      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Image style={{width:50,height:50,elevation:3}} source={require('../img/add.png')}/>
      </TouchableOpacity>

      {/* Modal thêm nhân viên */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 20,
            minHeight: '70%',
            maxHeight: '90%',
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 22,
              color: '#BB0000',
              marginBottom: 18,
              textAlign: 'center',
            }}>
              Thêm nhân viên
            </Text>
            <ScrollView>
              <TextInput style={styles.input} placeholder="Họ tên" value={ho_ten} onChangeText={setHoTen} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Mật khẩu" value={mat_khau} onChangeText={setMatKhau} secureTextEntry />
              <TextInput style={styles.input} placeholder="Số điện thoại" value={so_dien_thoai} onChangeText={setSoDienThoai} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Ngày sinh" value={ngay_sinh} onChangeText={setNgay_sinh} />
              <TextInput style={styles.input} placeholder="Giới tính" value={gioi_tinh} onChangeText={setGioi_tinh} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#BB0000',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                  onPress={handleAddStaff}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#888',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginLeft: 8,
                  }}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Quay lại</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal sửa nhân viên */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 20,
            minHeight: '70%',
            maxHeight: '90%',
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 22,
              color: '#BB0000',
              marginBottom: 18,
              textAlign: 'center',
            }}>
              Sửa nhân viên
            </Text>
            <ScrollView>
              <TextInput style={styles.input} placeholder="Họ tên" value={editData.ho_ten} onChangeText={text => setEditData({ ...editData, ho_ten: text })} />
              <TextInput style={styles.input} placeholder="Email" value={editData.email} onChangeText={text => setEditData({ ...editData, email: text })} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Mật khẩu" value={editData.mat_khau} onChangeText={text => setEditData({ ...editData, mat_khau: text })} secureTextEntry />
              <TextInput style={styles.input} placeholder="Số điện thoại" value={editData.so_dien_thoai} onChangeText={text => setEditData({ ...editData, so_dien_thoai: text })} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Ngày sinh" value={editData.ngay_sinh} onChangeText={text => setEditData({ ...editData, ngay_sinh: text })} />
              <TextInput style={styles.input} placeholder="Giới tính" value={editData.gioi_tinh} onChangeText={text => setEditData({ ...editData, gioi_tinh: text })} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#BB0000',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                  onPress={handleUpdateStaff}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#888',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginLeft: 8,
                  }}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Quay lại</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddStaff;

const styles = StyleSheet.create({
  title: {
    fontSize: 24, fontWeight: 'bold',margin:20
  },
  input: {
    width: '100%',  borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    marginBottom: 16, paddingHorizontal: 12, fontSize: 16,
  },
  button: {
    backgroundColor: '#BB0000', width: '100%', height: 50,
    justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,

 
    
    alignItems: 'center',
  
    
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    position: 'absolute',
    bottom: -7,
  },
card: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 16,
  marginHorizontal: 16,
  marginVertical: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
},
avatar: {
  width: 70,
  height: 70,
  borderRadius: 35,
  backgroundColor: '#eee',
},
cardTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 4,
},
cardText: {
  fontSize: 15,
  color: '#333',
  marginBottom: 2,
},
cardBtn: {
  paddingVertical: 6,
  paddingHorizontal: 18,
  borderRadius: 8,
},
});
