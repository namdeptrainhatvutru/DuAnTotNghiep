import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
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

  // 1. Auto fetch mỗi 3 giây
useEffect(() => {
  const interval = setInterval(() => {
    dispatch(fetchVeByKhachHangId(user.khach_hang_id));
  }, 3000);

  return () => clearInterval(interval);
}, []);

// 2. Cập nhật listVe và selectedVe khi listve thay đổi
useEffect(() => {
  setListVe(Array.isArray(listve) ? listve : []);

  if (selectedVe) {
    const updated = listve.find(v => v.ve_id === selectedVe.ve_id);
    if (updated) {
      setSelectedVe(updated);
    }
  }
}, [listve]);

// 3. Nếu selectedVe đã bị xóa thì đóng modal
useEffect(() => {
  if (selectedVe && !listve.some(v => v.ve_id === selectedVe.ve_id)) {
    setModalVisible(false);
    setSelectedVe(null);
  }
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
        height: '70%',
        width:150,
        marginTop: 24,
        
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
          <ImageBackground 
          source={require('../img/ticketpng.png')}
          style={{width: '100%', height: 150, justifyContent: 'center', alignItems: 'center'}}
          imageStyle={{borderRadius: 14}}
          >
            <Text style={styles.itemTitle}>{item.ten_phim}</Text>
        <Text>Ngày chiếu: {item.ngay_chieu}</Text>
        <Text>Giờ chiếu: {item.gio_chieu}</Text>
        <Text>Trạng thái: {isVeConHan(item) ? 'Còn hạn' : 'Hết hạn'}</Text>
          </ImageBackground>
        
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
                <Text style={styles.modalText}>
                  Mã vé: <Text style={{fontWeight: 'bold'}}>
                    {selectedVe.ve_id || (selectedVe.ma_qr && JSON.parse(selectedVe.ma_qr).ve_id)}
                  </Text>
                </Text>
                <Text style={styles.modalText}>Mã QR:</Text>
                <View style={{alignItems: 'center', marginVertical: 10}}>
                  <QRCode
                    // Tạo QR code từ object vé hiện tại, đảm bảo có ve_id
                    value={JSON.stringify({
                      ve_id: selectedVe.ve_id,
                      ten_phim: selectedVe.ten_phim,
                      ngay_chieu: selectedVe.ngay_chieu,
                      gio_chieu: selectedVe.gio_chieu,
                      ten_phong: selectedVe.ten_phong,
                      dia_chi_rap: selectedVe.dia_chi_rap,
                      vi_tri_ghe: selectedVe.vi_tri_ghe,
                      trang_thai: selectedVe.trang_thai,
                      // thêm các trường khác nếu muốn
                    })}
                    size={240}
                  />
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
    backgroundColor: '#b1b1b1ff',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 12,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EA5A5A',
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#EA5A5A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EA5A5A',
  },
  tabTextActive: {
    color: '#fff',
  },
  note: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  closeBtn: {
    backgroundColor: '#EA5A5A',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
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
});

