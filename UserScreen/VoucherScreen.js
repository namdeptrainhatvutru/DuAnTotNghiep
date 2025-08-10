import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addVoucher,
  fetchVoucher,
  updateVoucher,
  updateVoucherByMa,
} from '../redux/actions/VoucherAction';
import {updateUser} from '../redux/actions/UserAction';

const VoucherScreen = () => {
  const dispatch = useDispatch();
  const listvoucher = useSelector(state => state.voucher.listvoucher);
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(false);
  const [ma_voucher, Setma_voucher] = useState('');
  const chuaSoHuu = listvoucher.filter(
    item => !item.khach_hang_id || item.khach_hang_id === '',
  );

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVoucher()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleExchange = async item => {
    if (item.khach_hang_id === user.khach_hang_id) {
      alert('Bạn đã sở hữu voucher này!');
      return;
    }
    if (user.diem < 10) {
      alert('Bạn không đủ điểm để đổi voucher này!');
      return;
    }
    await dispatch(updateVoucher({...item, khach_hang_id: user.khach_hang_id}));
    // Trừ điểm user
    await dispatch(updateUser({...user, diem: user.diem - 10}));
    alert(` Chúc mừng bạn nhận được mã giảm giá : ${item.giam_gia}% `);
  };

  const nhapmavoucher = () => {
    const voucher = listvoucher.find(
      v => v.ma_voucher === ma_voucher && !v.khach_hang_id,
    );
    if (voucher) {
      // Voucher hợp lệ, thực hiện đổi
      dispatch(
        updateVoucherByMa({
          ma_voucher: ma_voucher,
          khach_hang_id: user.khach_hang_id,
        }),
      );
      Alert.alert('Đổi voucher thành công!');
      Setma_voucher('')
    } else {
      Alert.alert('Mã voucher không hợp lệ !');
      Setma_voucher('')
    }
   
  };

  // Hàm kiểm tra còn hạn
  const isVoucherValid = (voucher) => {
    if (!voucher.thoi_gian_het_han) return true; // Nếu không có hạn thì luôn hợp lệ
    const [day, month, year] = voucher.thoi_gian_het_han.split('/').map(Number);
    const expireDate = new Date(year, month - 1, day, 23, 59, 59);
    return expireDate >= new Date();
  };

  const renderItem = ({item}) => (
    <View style={styles.voucherBox}>
      <View style={{alignItems: 'center', marginBottom: 8}}>
        <Image
          style={{width: 90, height: 68, borderRadius: 8, marginBottom: 6}}
          source={require('../img/vouchermovi.png')}
        />
        
      </View>
      <Text style={styles.voucherTitle}>{item.ten_voucher || 'Voucher giảm giá ngẫu nhiên'}</Text>
      <Text style={styles.voucherExpire}>HSD: {item.thoi_gian_het_han || 'Không giới hạn'}</Text>
      <TouchableOpacity
        style={styles.exchangeBtn}
        onPress={() => handleExchange(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.exchangeBtnText}>Đổi voucher</Text>
        <View style={styles.pointBox}>
          <Text style={styles.pointText}>10</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 16}}>
      <Text style={{fontWeight: 'bold', fontSize: 22, marginBottom: 8, color: '#EA5A5A', textAlign: 'center'}}>
        🎁 Voucher miễn phí
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 18, color: '#444', textAlign: 'center'}}>
        Điểm của bạn: <Text style={{color: '#EA5A5A'}}>{user.diem}</Text>
      </Text>

      <View style={{flexDirection: 'row', marginBottom: 18, alignItems: 'center', justifyContent: 'center'}}>
        <TextInput
          placeholder="Nhập mã voucher..."
          onChangeText={Setma_voucher}
          value={ma_voucher}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#8B0000',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            marginRight: 8,
            backgroundColor: '#fafafa',
            fontSize: 15,
          }}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#8B0000',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 18,
          }}
          onPress={nhapmavoucher}
        >
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>Xác nhận</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#EA5A5A" />
      ) : (
        <FlatList
          data={listvoucher
            .filter(item => item.khach_hang_id !== user.khach_hang_id)
            .filter(isVoucherValid)
          }
          keyExtractor={item => item.voucher_id || item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{paddingBottom: 20}}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 30, color: '#888'}}>
              Chưa có voucher nào còn hạn
            </Text>
          }
        />
      )}
    </View>
  );
};

export default VoucherScreen;

const styles = StyleSheet.create({
  voucherBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    width: '48%',
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  voucherTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#EA5A5A',
    textAlign: 'center',
  },
  voucherDiscountTag: {
    backgroundColor: '#EA5A5A',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  voucherExpire: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  exchangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    fontSize: 14,
  },
});
