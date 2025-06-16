import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVoucher, fetchVoucher, updateVoucher } from '../redux/actions/VoucherAction'
import { updateUser } from '../redux/actions/UserAction'

const VoucherScreen = () => {
  const dispatch = useDispatch();
  const listvoucher = useSelector(state => state.voucher.listvoucher);
  const user = useSelector(state => state.user.user);
  useEffect(() => {
    dispatch(fetchVoucher());
  }, [dispatch]);

  const handleExchange = async (item) => {
  if (item.khach_hang_id === user.khach_hang_id) {
    alert('Bạn đã sở hữu voucher này!');
    return;
  }
  if (user.diem < item.giam_gia) {
    alert('Bạn không đủ điểm để đổi voucher này!');
    return;
  }
  await dispatch(updateVoucher({ ...item, khach_hang_id: user.khach_hang_id }));
  // Trừ điểm user
  await dispatch(updateUser({ ...user, diem: user.diem - item.giam_gia }));
  alert('Đổi voucher thành công!');
};



  const renderItem = ({ item }) => (
    <View style={styles.voucherBox}>
      <Text style={styles.voucherTitle}>{item.ma_voucher}</Text>
      <Text style={styles.voucherDiscount}>Giảm giá: {item.giam_gia}%</Text>
      <Text style={styles.voucherExpire}>Hạn: {item.thoi_gian_het_han}</Text>
      <Text style={styles.voucherDiscount2}>{item.khach_hang_id === user.khach_hang_id?'Bạn đã có voucher':''}</Text>
      <TouchableOpacity
        style={styles.exchangeBtn}
        onPress={() => {
          handleExchange(item)
          console.log('Đổi voucher:', item.ma_voucher);
        }}
      >
        <Text style={styles.exchangeBtnText}>Đổi voucher</Text>
        <View style={styles.pointBox}>
          <Text style={styles.pointText}>{item.giam_gia}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Danh sách Voucher</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Điểm của bạn : {user.diem}</Text>
      <FlatList
        data={listvoucher.filter(item => item.khach_hang_id !== user.khach_hang_id)}
        keyExtractor={item => item.voucher_id || item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Chưa có voucher nào</Text>}
      />
    </View>
  )
}

export default VoucherScreen

const styles = StyleSheet.create({
  voucherBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    width: '48%',
    elevation: 2,
    alignItems: 'center',
  },
  voucherTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#EA5A5A'
  },
  voucherDiscount: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333'
  },
  voucherDiscount2: {
    fontSize: 8,
    marginBottom: 4,
    color: '#333'
  },
  voucherExpire: {
    fontSize: 12,
    marginBottom: 10,
    color: '#888'
  },
  exchangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA5A5A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  exchangeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 14,
    
  },
  pointBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: {
    color: '#EA5A5A',
    fontWeight: 'bold',
    fontSize: 14
  }
});