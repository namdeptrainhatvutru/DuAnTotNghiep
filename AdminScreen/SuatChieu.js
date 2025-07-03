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
  const [searchPhim, setSearchPhim] = useState('');
  const listsuatchieu = useSelector(state => state.suatchieu.listsuatchieu);
  const listphim = useSelector(state => state.phim.listphim);
  console.log('list phim : ', listphim);
  const navigation = useNavigation();

  const handleDateChange = text => {
    // Loại bỏ ký tự không phải số
    const cleaned = text.replace(/[^\d]/g, '');

    let formatted = '';

    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4,
      )}/${cleaned.slice(4, 8)}`;
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
      const [day, month, year] = item.ngay_chieu.split('/');
      const ngayChieuDate = new Date(`${year}-${month}-${day}`);
      const now = new Date();
      ngayChieuDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      const diffTime = ngayChieuDate.getTime() - now.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        trangThai = 'Sắp chiếu';
      } else if (diffDays > 1) {
        trangThai = 'Chưa chiếu';
      }
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          borderRadius: 16,
          marginVertical: 8,
          padding: 14,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 3,
          alignItems: 'center',
        }}>
        <Image
          source={{uri: phim?.poster_url}}
          style={{
            width: 70,
            height: 100,
            borderRadius: 8,
            backgroundColor: '#eee',
            marginRight: 16,
          }}
        />
        <View style={{flex: 1}}>
          <Text
            style={{fontWeight: 'bold', fontSize: 16, color: '#EA5A5A'}}
            numberOfLines={2}>
            {phim ? phim.ten_phim : 'Không tìm thấy phim'}
          </Text>
          <Text style={{color: '#444', marginTop: 2}}>
            Ngày chiếu:{' '}
            <Text style={{fontWeight: 'bold'}}>{item.ngay_chieu}</Text>
          </Text>
          <Text style={{color: '#444', marginTop: 2}}>
            Thời gian:{' '}
            <Text style={{fontWeight: 'bold'}}>
              {item.thoi_gian_bat_dau}h - {item.thoi_gian_ket_thuc}h
            </Text>
          </Text>
          {trangThai !== '' && (
            <Text
              style={{
                marginTop: 4,
                color: trangThai === 'Sắp chiếu' ? '#FFA500' : '#8889D6',
                fontWeight: 'bold',
                fontSize: 13,
              }}>
              {trangThai}
            </Text>
          )}
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#1976D2',
                paddingVertical: 6,
                paddingHorizontal: 18,
                borderRadius: 6,
                marginRight: 10,
              }}
              onPress={() => {
                navigation.navigate('CapNhatSuatChieu', {
                  phim: phim,
                  suat_chieu: item,
                });
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#f55',
                paddingVertical: 6,
                paddingHorizontal: 18,
                borderRadius: 6,
              }}
              onPress={() => {
                dispatch(deleteSuatChieu(item.suat_chieu_id));
                dispatch(deleteGheBySuatChieuId(item.suat_chieu_id));
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: 20,
          backgroundColor: '#f9f9f9',
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 10,
          }}>
          Phòng: {ten_phong}
        </Text>
        <Text style={{fontSize: 18, color: '#555'}}>Danh sách suất chiếu</Text>
      </View>
      {!Array.isArray(listsuatchieu) || listsuatchieu.length === 0 ? (
        <Text>Không có suất chiếu nào</Text>
      ) : (
        <FlatList
          data={listsuatchieu}
          keyExtractor={item => item.suat_chieu_id}
          renderItem={renderItem}
        />
      )}
      <Modal visible={modal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 20,
              minHeight: '70%',
              maxHeight: '90%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 22,
                color: '#EA5A5A',
                marginBottom: 18,
                textAlign: 'center',
              }}>
              Thêm suất chiếu
            </Text>
            <View style={{marginBottom: 14}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 6,
                  color: '#222',
                  fontSize: 15,
                }}>
                Ngày chiếu
              </Text>
              <TextInput
                placeholder="dd/mm/yyyy"
                value={ngay_chieu}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: '#fafafa',
                }}
              />
            </View>
            <View style={{marginBottom: 14}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 6,
                  color: '#222',
                  fontSize: 15,
                }}>
                Thời gian bắt đầu
              </Text>
              <TextInput
                placeholder="Thời gian bắt đầu"
                value={thoi_gian_bat_dau}
                keyboardType="numeric"
                onChangeText={setthoi_gian_bat_dau}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: '#fafafa',
                }}
              />
            </View>
            <View style={{marginBottom: 14}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 6,
                  color: '#222',
                  fontSize: 15,
                }}>
                Thời gian kết thúc
              </Text>
              <TextInput
                placeholder="Thời gian kết thúc"
                value={thoi_gian_ket_thuc}
                keyboardType="numeric"
                onChangeText={setthoi_gian_ket_thuc}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: '#fafafa',
                }}
              />
            </View>
            <View style={{marginBottom: 14}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 6,
                  color: '#222',
                  fontSize: 15,
                }}>
                Phim
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fafafa',
                  alignItems: 'center',
                }}
                onPress={() => setPhimModal(true)}>
                <Text style={{color: phim_id ? '#222' : '#888'}}>
                  {phim_id
                    ? listphim.find(p => p.phim_id === phim_id)?.ten_phim ||
                      'Chọn phim'
                    : 'Chọn phim'}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#EA5A5A',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginRight: 8,
                }}
                onPress={handleAddSuatCHieu}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                  Thêm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#888',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginLeft: 8,
                }}
                onPress={() => setModal(false)}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                  Quay lại
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal chọn phim */}
      <Modal visible={phimModal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 20,
              minHeight: '70%',
              maxHeight: '90%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 20, flex: 1}}>
                Chọn phim
              </Text>
              <TouchableOpacity onPress={() => setPhimModal(false)}>
                <Text
                  style={{fontSize: 18, color: '#EA5A5A', fontWeight: 'bold'}}>
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Tìm kiếm phim..."
              value={searchPhim}
              onChangeText={setSearchPhim}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 8,
                marginBottom: 16,
                fontSize: 16,
              }}
            />
            <ScrollView>
              {listphim
                .filter(item =>
                  item.ten_phim
                    .toLowerCase()
                    .includes(searchPhim.toLowerCase()),
                )
                .map(item => (
                  <TouchableOpacity
                    key={item.phim_id}
                    onPress={() => {
                      setphim_id(item.phim_id);
                      setPhimModal(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor:
                        phim_id === item.phim_id ? '#EA5A5A' : '#eee',
                      borderRadius: 10,
                      padding: 10,
                      backgroundColor:
                        phim_id === item.phim_id ? '#FFF0F0' : '#fff',
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
                    }}>
                    <Image
                      source={{uri: item.poster_url}}
                      style={{
                        width: 60,
                        height: 90,
                        borderRadius: 6,
                        marginRight: 14,
                        backgroundColor: '#eee',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight:
                          phim_id === item.phim_id ? 'bold' : 'normal',
                        color: phim_id === item.phim_id ? '#EA5A5A' : '#222',
                      }}>
                      {item.ten_phim}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SuatChieu;

const styles = StyleSheet.create({});
