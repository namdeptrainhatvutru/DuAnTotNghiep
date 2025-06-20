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

  const renderItem = ({item}) => (
    <View style={styles.voucherBox}>
      <Text
        style={{position: 'absolute', zIndex: 99, fontSize: 20, bottom: '63%'}}>
        ?
      </Text>
      <Image
        style={{width: 120, height: 90}}
        source={require('../img/vouchermovi.png')}
      />

      <TouchableOpacity
        style={styles.exchangeBtn}
        onPress={() => {
          handleExchange(item);
          console.log('Đổi voucher:', item.ma_voucher);
        }}>
        <Text style={styles.exchangeBtnText}>Đổi voucher</Text>
        <View style={styles.pointBox}>
          <Text style={styles.pointText}>10</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
      <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>
        Voucher miễn phí
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>
        Điểm của bạn : {user.diem}
      </Text>

      <TextInput
        placeholder="Nhập mã voucher?"
        onChangeText={Setma_voucher}
        value={ma_voucher}
      />
      <Button title="Xác nhận" onPress={nhapmavoucher} />
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#EA5A5A" />
        </>
      ) : (
        <FlatList
          data={listvoucher.filter(
            item => item.khach_hang_id !== user.khach_hang_id,
          )}
          keyExtractor={item => item.voucher_id || item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{paddingBottom: 20}}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 30}}>
              Chưa có voucher nào
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
    color: '#EA5A5A',
  },
  voucherDiscount: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  voucherDiscount2: {
    fontSize: 8,
    marginBottom: 4,
    color: '#333',
  },
  voucherExpire: {
    fontSize: 12,
    marginBottom: 10,
    color: '#888',
  },
  exchangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA5A5A',
    borderRadius: 8,
    padding: 5,
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
