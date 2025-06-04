import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPhongChieu,
  deletePhongChieu,
  fetchPhongChieu,
  updatePhongChieu,
} from '../redux/actions/PhongChieuAction';
import { useNavigation } from '@react-navigation/native';

const PhongChieu = ({ route }) => {
  const { cinema_id, ten_rap } = route.params;
  const dispatch = useDispatch();
  const [ten_phong, setTen_Phong] = useState('');
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigation = useNavigation()
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    dispatch(fetchPhongChieu(cinema_id)).then(() => {
      setLoading(false);
    });
  }, [cinema_id, dispatch]);

  // if () {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color="#EA5A5A" />
  //       <Text style={styles.noRoomText}>Không có phòng chiếu nào</Text>
  //     </View>
  //   );
  // }

  const handleAdd = () => {
    if (ten_phong.trim() === '') {
      alert('Vui lòng nhập tên phòng');
      return;
    }
    const newRoom = {
      ten_phong: ten_phong,
      cinema_id: cinema_id,
    };
    dispatch(addPhongChieu(newRoom)).then(() => {
      setTen_Phong('');
    });
  };

  const handleDelete = room_id => {
    dispatch(deletePhongChieu(room_id));
  };

  const handleEdit = () => {
    const updatedRoom = {
      room_id: selectedRoom.room_id,
      ten_phong: ten_phong,
    };
    dispatch(updatePhongChieu(updatedRoom)).then(() => {
      setModalVisible(false);
      setTen_Phong('');
      setSelectedRoom(null);
    });
  };

  const openModal = item => {
    setModalVisible(true);
    setSelectedRoom(item);
    setTen_Phong(item.ten_phong);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.roomTitle}>Phòng: {item.ten_phong}</Text>
      <Text style={styles.roomId}>ID: {item.room_id}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.room_id)}>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item)}>
          <Text style={styles.btnText}>Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.editBtn,{backgroundColor:'green'}]} onPress={() => {navigation.navigate('SuatChieu', { room_id: item.room_id, ten_phong: item.ten_phong })}}>
          <Text style={styles.btnText}>Suất chiếu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ten_rap}</Text>
      <TextInput
        placeholder="Tên phòng"
        value={ten_phong}
        onChangeText={setTen_Phong}
        style={styles.input}
      />
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>Thêm phòng chiếu</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#EA5A5A" />
          <Text style={styles.noRoomText}>Đang tải phòng chiếu...</Text>
        </View>
      ) : !listPhongChieu || listPhongChieu.length === 0 || listPhongChieu === 'Not found' ? (
        <View style={styles.centered}>
          <Text style={styles.noRoomText}>Không có phòng chiếu nào</Text>
        </View>
      ) : (
        <FlatList
          data={listPhongChieu}
          keyExtractor={item => item.room_id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        {selectedRoom && (
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Tên phòng"
              value={ten_phong}
              onChangeText={setTen_Phong}
              style={styles.input}
            />
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
              <Text style={styles.btnText}>Cập nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setModalVisible(false);
                setTen_Phong('');
              }}
            >
              <Text style={styles.btnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default PhongChieu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
    borderColor: '#DDD',
    marginBottom: 12,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#388E3C',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  roomId: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteBtn: {
    backgroundColor: '#E53935',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editBtn: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noRoomText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
});
