import { StyleSheet, Text, View, FlatList, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchVoucher } from '../redux/actions/VoucherAction'

const KhoVoucher = () => {
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.user.khach_hang_id);
  const listvoucher = useSelector(state => state.voucher.listvoucher);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchVoucher());
    }
  }, [dispatch, user_id]);

  const listvoucherbyid = listvoucher.filter(item => item.khach_hang_id === user_id.toString())

  const renderItem = ({ item }) => (
    <ImageBackground
      source={require('../img/ticketpng.png')}
      style={styles.voucherBox}
      imageStyle={{ borderRadius: 16 }}
    >
      <Text style={styles.voucherTitle}>{item.ma_voucher}</Text>
      <Text style={styles.voucherDiscount}>🎉 Giảm giá: {item.giam_gia}%</Text>
      <Text style={styles.voucherExpire}>⏰ Hạn: {item.thoi_gian_het_han}</Text>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#8B0000',marginBottom:20,padding:10}}>
        <Text style={styles.header}>Kho Voucher của bạn</Text>
      </View>
      
      <FlatList
        data={listvoucherbyid}
        keyExtractor={item => item.voucher_id?.toString() || item.id?.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bạn chưa có voucher nào</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  )
}

export default KhoVoucher

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  voucherBox: {
    borderRadius: 16,
    padding: 34,
    marginBottom: 16,
    overflow: 'hidden',
    
  },
  voucherTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#EA5A5A',
  },
  voucherDiscount: {
    fontSize: 16,
    marginBottom: 6,
    color: '#222',
  },
  voucherExpire: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 40,
    fontSize: 16,
  },
});
