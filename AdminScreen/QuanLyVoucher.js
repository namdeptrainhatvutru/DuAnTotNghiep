import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoucher, addVoucher, deleteVoucher, updateVoucher } from '../redux/actions/VoucherAction';



const QuanLyVoucher = () => {
  const dispatch = useDispatch();
  const listvoucher = useSelector(state => state.voucher.listvoucher);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [ma_voucher, setMaVoucher] = useState('');
  const [giam_gia, setGiamGia] = useState('');
  const [thoi_gian_het_han, setThoiGianHetHan] = useState('');
  const [khach_hang_id, setKhachHangId] = useState('');
  const [loading, setLoading] = useState(false);
  const [soLuong, setSoLuong] = useState('1'); // Thêm trường số lượng

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVoucher()).then(() => setLoading(false));
  }, [dispatch]);

  const openAddModal = () => {
    setIsEdit(false);
    setCurrentVoucher(null);
    setMaVoucher('');
    setGiamGia('');
    setThoiGianHetHan('');
    setKhachHangId('');
    setSoLuong('1'); // reset số lượng khi mở modal
    setModalVisible(true);
  };

  const openEditModal = (voucher) => {
  setIsEdit(true);
  setCurrentVoucher(voucher);
  setMaVoucher(voucher.ma_voucher);
  setGiamGia(String(voucher.giam_gia));
  // Convert timestamp to yyyy-mm-dd for input
  
  setThoiGianHetHan(voucher.thoi_gian_het_han);
  setKhachHangId(voucher.khach_hang_id ? String(voucher.khach_hang_id) : '');
  setModalVisible(true);
};

const handleSave = async () => {
    if (!ma_voucher || !giam_gia || !thoi_gian_het_han) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    const voucherData = {
      ma_voucher,
      giam_gia: Number(giam_gia),
      thoi_gian_het_han,
      khach_hang_id: "",
    };
    if (isEdit && currentVoucher) {
      await dispatch(updateVoucher({ ...currentVoucher, ...voucherData }));
    } else {
      const n = parseInt(soLuong, 10);
      if (isNaN(n) || n <= 0) {
        Alert.alert('Lỗi', 'Số lượng phải là số nguyên dương!');
        setLoading(false);
        return;
      }
      for (let i = 0; i < n; i++) {
        const newVoucher = {
          ...voucherData,
          ma_voucher: n === 1 ? ma_voucher : `${ma_voucher}_${Date.now()}_${i}`,
        };
        await dispatch(addVoucher(newVoucher));
      }
    }
    await dispatch(fetchVoucher());
    setLoading(false);
    setModalVisible(false);
  };


  const handleDelete = (voucher_id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa voucher này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await dispatch(deleteVoucher(voucher_id));
          await dispatch(fetchVoucher());
          setLoading(false);
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
  // So sánh ngày hết hạn với ngày hiện tại
  let status = '';
  if (item.thoi_gian_het_han) {
    const now = new Date();
    let expire;
    if (item.thoi_gian_het_han.includes('/')) {
      // Nếu là dd/MM/yyyy
      const [day, month, year] = item.thoi_gian_het_han.split('/');
      expire = new Date(`${year}-${month}-${day}`);
    } else {
      // Nếu là yyyy-MM-dd
      expire = new Date(item.thoi_gian_het_han);
    }
    status = expire < now ? 'Hết hạn ⚠️' : 'Còn hạn';
  }
  return (
    <View style={[styles.item,{borderWidth:2,borderColor:status=='Còn hạn'?'':'red'}]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Mã: {item.ma_voucher}</Text>
        <Text>Giảm giá: {item.giam_gia}%</Text>
        <Text>Hết hạn: {item.thoi_gian_het_han || ''}</Text>
        <Text>Trạng thái: {status}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
        <Text style={{ color: 'white' }}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.voucher_id || item.id)}>
        <Text style={{ color: 'white' }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
};
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Quản lý Voucher</Text>
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Thêm voucher</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#EA5A5A" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={listvoucher}
          keyExtractor={item => item.voucher_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Chưa có voucher nào</Text>}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              {isEdit ? 'Sửa voucher' : 'Thêm voucher'}
            </Text>
            <TextInput
              placeholder="Mã voucher"
              value={ma_voucher}
              onChangeText={setMaVoucher}
              style={styles.input}
            />
            <TextInput
              placeholder="Giảm giá (%)"
              value={giam_gia}
              onChangeText={setGiamGia}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Thời gian hết hạn (yyyy-mm-dd)"
              value={thoi_gian_het_han}
              onChangeText={setThoiGianHetHan}
              style={styles.input}
              keyboardType="default"
            />
            {!isEdit && (
              <TextInput
                placeholder="Số lượng voucher"
                value={soLuong}
                onChangeText={setSoLuong}
                style={styles.input}
                keyboardType="numeric"
              />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: 'white' }}>{isEdit ? 'Lưu' : 'Thêm'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: 'white' }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QuanLyVoucher;

// ...styles giữ nguyên...

// ...styles giữ nguyên...

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#EA5A5A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  editBtn: {
    backgroundColor: '#4B8DF8',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteBtn: {
    backgroundColor: '#EA5A5A',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: 300,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#4B8DF8',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelBtn: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
});