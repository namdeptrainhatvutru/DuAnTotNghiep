import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  addRapChieu,
  deleteRapChieu,
  fetchRapChieu,
  updateRapChieu,
} from '../redux/actions/RapChieuAction';
import { useNavigation } from '@react-navigation/native';

const QuanLyRapChieu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [ten_rap, setTenRap] = useState('');
  const [dia_chi, setDiaChi] = useState('');
  const dispatch = useDispatch();
  const listRapChieu = useSelector(state => state.rapchieu.listrapchieu);
  const [selectedRapChieu, setSelectedRapChieu] = useState(null);
  const navigation = useNavigation()
  useEffect(() => {
    dispatch(fetchRapChieu());
  }, []);

  const handleAddRapChieu = async () => {
    if (!ten_rap.trim() || !dia_chi.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    const rapchieu = {ten_rap, dia_chi};
    dispatch(addRapChieu(rapchieu)).then(() => {
  setModalVisible(false);
  setTenRap('');
  setDiaChi('');
  Alert.alert('thêm thành công')
  setTimeout(() => {
    dispatch(fetchRapChieu());
  }, 300); // 300ms
});
  };

  const handleDeleteRapChieu = id => {
    dispatch(deleteRapChieu(id)).then(() => {
      setModalVisible2(false);
      setTenRap('');
      setDiaChi('');
      setSelectedRapChieu(null);
      dispatch(fetchRapChieu());
    });
  };

  const openChinhSuaRapChieu = item => {
    setSelectedRapChieu(item);
    setModalVisible2(true);
    setTenRap(item.ten_rap);
    setDiaChi(item.dia_chi);
  };

  const handleUpdateRapChieu = () => {
    if (!ten_rap.trim() || !dia_chi.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    const updated = {
      ...selectedRapChieu,
      ten_rap,
      dia_chi,
    };
    dispatch(updateRapChieu(updated)).then(() => {
      setModalVisible2(false);
      setSelectedRapChieu(null);
      setTenRap('');
      setDiaChi('');
      dispatch(fetchRapChieu());
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View>
          <Text style={styles.cardTitle}>{item.ten_rap}</Text>
          <Text style={styles.cardAddress}>{item.dia_chi}</Text>
        </View>
        <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}} onPress={()=>{navigation.navigate('PhongChieu', {cinema_id: item.cinema_id, ten_rap: item.ten_rap})}} 
          >
        <View >
          <Image
            style={{width: 50, height: 50}}
            source={require('../img/RightArrowIn.png')}
          />
        </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => openChinhSuaRapChieu(item)}>
        <Text style={styles.editBtnText}>Chỉnh sửa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <Text style={styles.title}>Danh sách rạp chiếu</Text>
      <FlatList
        data={listRapChieu}
        keyExtractor={item => item.cinema_id}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16, paddingBottom: 120}}
      />
      <TouchableOpacity
        style={styles.addStyle}
        onPress={() => setModalVisible(true)}>
        <Image style={styles.addIcon} source={require('../img/add.png')} />
      </TouchableOpacity>

      {/* Modal Thêm */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm rạp chiếu</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên rạp"
              value={ten_rap}
              onChangeText={setTenRap}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={dia_chi}
              onChangeText={setDiaChi}
            />
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleAddRapChieu}>
              <Text style={styles.modalBtnText}>Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.closeBtn]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Sửa/Xóa */}
      <Modal visible={modalVisible2} animationType="slide" transparent>
        {selectedRapChieu && (
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chỉnh sửa rạp chiếu</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên rạp"
                value={ten_rap}
                onChangeText={setTenRap}
              />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={dia_chi}
                onChangeText={setDiaChi}
              />
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleUpdateRapChieu}>
                <Text style={styles.modalBtnText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: '#f55'}]}
                onPress={() =>
                  handleDeleteRapChieu(selectedRapChieu.cinema_id)
                }>
                <Text style={styles.modalBtnText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.closeBtn]}
                onPress={() => {
                  setModalVisible2(false);
                  setTenRap('');
                  setDiaChi('');
                }}>
                <Text style={styles.modalBtnText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default QuanLyRapChieu;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#BB0000',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#BB0000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#BB0000',
    marginBottom: 6,
  },
  cardAddress: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    marginLeft: 2,
  },
  editBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  addStyle: {
    width: 64,
    height: 64,
    position: 'absolute',
    bottom: 28,
    right: 28,
    borderRadius: 32,
    backgroundColor: '#BB0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#BB0000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  addIcon: {
    width: 40,
    height: 40,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#BB0000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#BB0000',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  modalBtn: {
    backgroundColor: '#BB0000',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: '#aaa',
    marginTop: 8,
  },
});
