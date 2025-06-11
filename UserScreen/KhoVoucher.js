import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchVoucher, fetchVoucherById } from '../redux/actions/VoucherAction'

const KhoVoucher = () => {
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.user.khach_hang_id);
  const listvoucher = useSelector(state => state.voucher.listvoucher);
  console.log(listvoucher);
  console.log('user id',user_id);
  
  

  useEffect(() => {
    if (user_id) {
      dispatch(fetchVoucher());
    }
  }, [dispatch, user_id]);
    const listvoucherbyid = listvoucher.filter(item => item.khach_hang_id === user_id.toString())
  const renderItem = ({ item }) => (
    <View style={styles.voucherBox}>
      <Text style={styles.voucherTitle}>{item.ma_voucher}</Text>
      <Text style={styles.voucherDiscount}>Giảm giá: {item.giam_gia}%</Text>
      <Text style={styles.voucherExpire}>Hạn: {item.thoi_gian_het_han}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Kho Voucher của bạn</Text>
      <FlatList
        data={listvoucherbyid}
        keyExtractor={item => item.voucher_id || item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Bạn chưa có voucher nào</Text>}
      />
    </View>
  )
}

export default KhoVoucher

const styles = StyleSheet.create({
  voucherBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
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
  voucherExpire: {
    fontSize: 12,
    marginBottom: 10,
    color: '#888'
  }
});