import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteVe, fetchVeByKhachHangId} from '../redux/actions/VeAction';
import QRCode from 'react-native-qrcode-svg';
import {ActivityIndicator} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import { Alert } from 'react-native';

const KhoVe = () => {
  const user = useSelector(state => state.user.user);
  const listve = useSelector(state => state.ve.listve);
  const [listVe, setListVe] = useState([]);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVe, setSelectedVe] = useState(null);
  const [tab, setTab] = useState('conhan'); // 'conhan' hoặc 'hethanh'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVeByKhachHangId(user.khach_hang_id)).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setListVe(Array.isArray(listve) ? listve : []);
  }, [listve]);

  // Hàm kiểm tra vé còn hạn/hết hạn
  const isVeConHan = ve => {
    const ngay = ve.ngay_chieu.split('/').reverse().join('-');
    return new Date(ngay) >= new Date();
  };

  const veConHan = (Array.isArray(listVe) ? listVe : []).filter(isVeConHan);
  const veHetHan = (Array.isArray(listVe) ? listVe : []).filter(ve => !isVeConHan(ve));



const handleDelete = ve_id => {
  Alert.alert(
    'Xác nhận',
    'Bạn có chắc chắn muốn xóa vé này không?',
    [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          dispatch(deleteVe(ve_id));
        },
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
};


  const renderRightActions = (progress, dragX, onDelete) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: 199,
        width:150
      }}
      onPress={onDelete}>
        <Image style={{width:50,height:50}} source={require('../img/delete.png')}/>
      
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, () => handleDelete(item.ve_id))
      }
      // onSwipeableRightOpen={() => handleDelete(item.ve_id)} 
    >
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedVe(item);
          setModalVisible(true);
        }}
        activeOpacity={0.7}>
        <Text style={styles.itemTitle}>{item.ten_phim}</Text>
        <Text>Ngày chiếu: {item.ngay_chieu}</Text>
        <Text>Giờ chiếu: {item.gio_chieu}</Text>
        <Text>Trạng thái: {isVeConHan(item) ? 'Còn hạn' : 'Hết hạn'}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderEmpty = () => (
    <View style={{alignItems: 'center', marginTop: 60}}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076549.png',
        }}
        style={{width: 120, height: 120, marginBottom: 16}}
        resizeMode="contain"
      />
      <Text style={{color: '#888', fontSize: 16, fontWeight: 'bold'}}>
        Không có dữ liệu !
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vé của bạn</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'conhan' && styles.tabActive]}
          onPress={() => setTab('conhan')}>
          <Text
            style={[styles.tabText, tab === 'conhan' && styles.tabTextActive]}>
            Phim sắp xem
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'hethan' && styles.tabActive]}
          onPress={() => setTab('hethan')}>
          <Text
            style={[styles.tabText, tab === 'hethan' && styles.tabTextActive]}>
            Phim đã xem
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.note}>
        Chỉ hiển thị giao dịch online trong 3 tháng gần nhất.{'\n'}
        Để kiểm tra lịch sử giao dịch tại quầy vui lòng liên hệ online: 0987 654
        321
      </Text>

      {loading ? (
        <>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#EA5A5A" />
            <Text>Đang tải dữ liệu...</Text>
          </View>
        </>
      ) : (
        <FlatList
          data={tab === 'conhan' ? veConHan.slice().reverse() : veHetHan.slice().reverse()}
          keyExtractor={item => item.ve_id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 40}}
          ListEmptyComponent={renderEmpty}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chi tiết vé</Text>
            {selectedVe && (
              <>
                <Text style={styles.modalText}>
                  Phòng chiếu:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {selectedVe.ten_phong}
                  </Text>
                </Text>
                <Text style={styles.modalText}>
                  Rạp:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {selectedVe.dia_chi_rap}
                  </Text>
                </Text>
                <Text style={styles.modalText}>
                  Số ghế:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {selectedVe.vi_tri_ghe}
                  </Text>
                </Text>
                <Text style={styles.modalText}>
                  Ngày chiếu:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {selectedVe.ngay_chieu}
                  </Text>
                </Text>
                <Text style={styles.modalText}>
                  Giờ chiếu:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {selectedVe.gio_chieu}
                  </Text>
                </Text>
                <Text style={styles.modalText}>Mã QR:</Text>
                <View style={{alignItems: 'center', marginVertical: 10}}>
                  <QRCode value={selectedVe.ma_qr} size={240} />
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Đóng</Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EA5A5A',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabActive: {
    backgroundColor: '#EA5A5A',
  },
  tabText: {
    color: '#EA5A5A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#fff',
  },
  note: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius:12,
    borderTopEndRadius: 0,
    borderBottomRightRadius: 0,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
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
    flex: 1,
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
