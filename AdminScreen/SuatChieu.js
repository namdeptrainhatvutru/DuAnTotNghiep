import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addSuatChieu,
  deleteSuatChieu,
  fetchSuatChieu,
} from '../redux/actions/SuatChieuAction';
import {fetchPhim} from '../redux/actions/PhimAction';
import {Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {addGhe, deleteGheBySuatChieuId} from '../redux/actions/GheAction';

const SuatChieu = ({route}) => {
  const {room_id, ten_phong} = route.params;
  const dispatch = useDispatch();
  const [ngay_chieu, setngay_chieu] = useState('');
  const [thoi_gian_bat_dau, setthoi_gian_bat_dau] = useState('');
  const [thoi_gian_ket_thuc, setthoi_gian_ket_thuc] = useState('');
  const [phim_id, setphim_id] = useState('');
  const [modal, setModal] = useState(false);
  const [phimModal, setPhimModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const listsuatchieu = useSelector(state => state.suatchieu.listsuatchieu);
  const listphim = useSelector(state => state.phim.listphim);
  console.log('list phim : ', listphim);
  const navigation = useNavigation();

  const handleDateChange = (text) => {
  // Loại bỏ ký tự không phải số
  const cleaned = text.replace(/[^\d]/g, '');

  let formatted = '';

  if (cleaned.length <= 2) {
    formatted = cleaned;
  } else if (cleaned.length <= 4) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }

  // Validate giới hạn ngày và tháng
  const parts = formatted.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);

  if (day > 31) parts[0] = '31';
  if (month > 12) parts[1] = '12';

  // Gộp lại nếu cần
  if (parts.length === 3) {
    formatted = `${parts[0]}/${parts[1]}/${parts[2]}`;
  } else if (parts.length === 2) {
    formatted = `${parts[0]}/${parts[1]}`;
  } else {
    formatted = parts[0];
  }

  setngay_chieu(formatted);
};


  useEffect(() => {
    setLoading(true); // Bắt đầu loading khi room_id đổi
    dispatch(fetchPhim());
    dispatch(fetchSuatChieu(room_id)).then(() => {
      setLoading(false); // Kết thúc loading khi fetch xong
    });
  }, [dispatch, room_id]);

  const renderItem = ({item}) => {
    const phim = listphim.find(p => p.phim_id === item.phim_id);

    // Xử lý ngày chiếu
    let trangThai = '';
    if (item.ngay_chieu) {
      // Chuyển dd/mm/yyyy về yyyy-mm-dd để so sánh
      const [day, month, year] = item.ngay_chieu.split('/');
      const ngayChieuDate = new Date(`${year}-${month}-${day}`);
      const now = new Date();
      // Đặt giờ về 0 để so sánh ngày
      ngayChieuDate.setHours(0,0,0,0);
      now.setHours(0,0,0,0);

      const diffTime = ngayChieuDate.getTime() - now.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        trangThai = 'Sắp chiếu';
      } else if (diffDays > 1) {
        trangThai = 'Chưa chiếu';
      }
      // Nếu diffDays <= 0 thì không hiện gì (đang chiếu hoặc đã chiếu)
    }

    return (
      <View style={{borderWidth: 1, borderRadius: 20, padding: 10, margin: 5}}>
        <Text>ID :{item.suat_chieu_id}</Text>
        <Text>Ngày chiếu : {item.ngay_chieu}</Text>
        <View style={{alignItems: 'center', marginBottom: 6, flexDirection: 'row'}}>
          {phim ? (
            <>
              <Image
                source={{uri: phim.poster_url}}
                style={{width: 60, height: 90, borderRadius: 8}}
              />
              <View>
                <Text style={{fontWeight: 'bold', marginTop: 4}}>
                  {phim.ten_phim}
                </Text>
                {trangThai !== '' && (
                  <Text style={{color: '#EA5A5A', fontWeight: 'bold', marginTop: 2}}>
                    {trangThai}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <Text style={{color: 'red'}}>Không tìm thấy phim</Text>
          )}
        </View>
        <Text>Thời gian suất chiếu : </Text>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderRadius: 40,
            padding: 5,
            margin: 5,
            width: 90,
            justifyContent: 'space-evenly',
          }}>
          <Text>{item.thoi_gian_bat_dau}</Text>
          <Text>-</Text>
          <Text>{item.thoi_gian_ket_thuc}</Text>
        </View>
        <Button
          title="chỉnh sửa"
          onPress={() => {
            navigation.navigate('CapNhatSuatChieu', {
              phim: phim,
              suat_chieu: item,
            });
          }}
        />
        <Button
          title="xóa"
          onPress={() => {
            dispatch(deleteSuatChieu(item.suat_chieu_id));
            dispatch(deleteGheBySuatChieuId(item.suat_chieu_id));
          }}
        />
      </View>
    );
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const handleAddSuatCHieu = () => {
    const suatchieu = {
      room_id: room_id,
      ngay_chieu: ngay_chieu,
      thoi_gian_bat_dau: thoi_gian_bat_dau,
      thoi_gian_ket_thuc: thoi_gian_ket_thuc,
      phim_id: phim_id,
    };
    dispatch(addSuatChieu(suatchieu)).then(res => {
      const createdSuatChieu = res.payload;
      // Tạo 30 ghế cho suất chiếu này
      if (createdSuatChieu && createdSuatChieu.suat_chieu_id) {
        for (let i = 1; i <= 30; i++) {
          const newGhe = {
            vi_tri: `G${i}`,
            suat_chieu_id: createdSuatChieu.suat_chieu_id,
            trang_thai: 'trống',
          };
          dispatch(addGhe(newGhe));
        }
      }
      dispatch(fetchSuatChieu(room_id));
      Alert.alert('Thêm thành công');
      setModal(false);
      setngay_chieu('');
      setthoi_gian_bat_dau('');
      setthoi_gian_ket_thuc('');
      setphim_id('');
    });
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1, padding: 10}}>
      <TouchableOpacity
        onPress={() => setModal(true)}
        style={{position: 'absolute', zIndex: 2, right: 20, bottom: 90}}>
        <Image
          style={{width: 80, height: 80}}
          source={require('../img/add.png')}
        />
      </TouchableOpacity>
      <Text>Phòng : {ten_phong}</Text>
      <Text>Danh sách suất chiếu</Text>
      {!Array.isArray(listsuatchieu) || listsuatchieu.length === 0 ? (
        <Text>Không có suất chiếu nào</Text>
      ) : (
        <FlatList
          data={listsuatchieu}
          keyExtractor={item => item.suat_chieu_id}
          renderItem={renderItem}
        />
      )}
      <Modal visible={modal} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}>
          <Text>Thêm suất chiếu</Text>
          <TextInput
            placeholder="dd/mm/yyyy"
            value={ngay_chieu}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10} // 10 ký tự: dd/mm/yyyy
          />
          <TextInput
            placeholder="Thời gian bắt đầu"
            value={thoi_gian_bat_dau}
            onChangeText={setthoi_gian_bat_dau}
          />
          <TextInput
            placeholder="Thời gian kết thúc"
            value={thoi_gian_ket_thuc}
            onChangeText={setthoi_gian_ket_thuc}
          />
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
              marginVertical: 10,
              width: 200,
              alignItems: 'center',
              backgroundColor: '#eee',
            }}
            onPress={() => setPhimModal(true)}>
            <Text>
              {phim_id
                ? listphim.find(p => p.phim_id === phim_id)?.ten_phim ||
                  'Chọn phim'
                : 'Chọn phim'}
            </Text>
          </TouchableOpacity>
          <Button title="Thêm" onPress={handleAddSuatCHieu} />
          <Button title="Quay lại" onPress={() => setModal(false)} />
        </View>
      </Modal>

      {/* Modal chọn phim */}
      <Modal visible={phimModal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              width: 320,
              maxHeight: 400,
            }}>
            <Text style={{fontWeight: 'bold', marginBottom: 10}}>
              Chọn phim
            </Text>
            <ScrollView horizontal={false}>
              {listphim.map(item => (
                <TouchableOpacity
                  key={item.phim_id}
                  onPress={() => {
                    setphim_id(item.phim_id);
                    setPhimModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor:
                      phim_id === item.phim_id ? '#d0ebff' : '#fff',
                  }}>
                  <Image
                    source={{uri: item.poster_url}}
                    style={{
                      width: 50,
                      height: 75,
                      borderRadius: 4,
                      marginRight: 10,
                    }}
                  />
                  <Text>{item.ten_phim}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Đóng" onPress={() => setPhimModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SuatChieu;

const styles = StyleSheet.create({});
