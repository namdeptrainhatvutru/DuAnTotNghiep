import { FlatList, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVe, fetchVeByKhachHangId } from '../redux/actions/VeAction';
import QRCode from 'react-native-qrcode-svg';

const KhoVe = () => {
  const user = useSelector(state => state.user.user);
  const listve = useSelector(state => state.ve.listve);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVe, setSelectedVe] = useState(null);

  useEffect(() => {
    dispatch(fetchVeByKhachHangId(user.khach_hang_id));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedVe(item);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.itemTitle}>{item.ten_phim}</Text>
      <Text>Ngày chiếu: {item.ngay_chieu}</Text>
      <Text>Giờ chiếu: {item.gio_chieu}</Text>
      <Text>
  Trạng thái: {
    new Date(item.ngay_chieu.split('/').reverse().join('-')) < new Date()
      ? 'Hết hạn'
      : 'Còn hạn'
  }
</Text>
      
      <Text
        style={styles.deleteBtn}
        onPress={() => dispatch(deleteVe(item.ve_id))}
      >
        Xóa vé
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kho vé của bạn</Text>
      <FlatList
        data={listve}
        keyExtractor={item => item.ve_id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
      <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Chi tiết vé</Text>
      {selectedVe && (
        <>
          <Text style={styles.modalText}>
            Phòng chiếu: <Text style={{ fontWeight: 'bold' }}>{selectedVe.ten_phong}</Text>
          </Text>
          <Text style={styles.modalText}>
            Rạp: <Text style={{ fontWeight: 'bold' }}>{selectedVe.dia_chi_rap}</Text>
          </Text>
          <Text style={styles.modalText}>
            Số ghế: <Text style={{ fontWeight: 'bold' }}>{selectedVe.vi_tri_ghe}</Text>
          </Text>
          <Text style={styles.modalText}>
            Ngày chiếu: <Text style={{ fontWeight: 'bold' }}>{selectedVe.ngay_chieu}</Text>
          </Text>
          <Text style={styles.modalText}>
            Giờ chiếu: <Text style={{ fontWeight: 'bold' }}>{selectedVe.gio_chieu}</Text>
          </Text>
          <Text style={styles.modalText}>
            Mã QR:
          </Text>
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <QRCode value={selectedVe.ma_qr} size={240} />
          </View>
        </>
      )}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setModalVisible(false)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đóng</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};

export default KhoVe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#EA5A5A',
    alignSelf: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 4,
  },
  deleteBtn: {
    color: '#fff',
    backgroundColor: '#d9534f',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 8,
    width: 80,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex:1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 18,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#222',
  },
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#EA5A5A',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
});