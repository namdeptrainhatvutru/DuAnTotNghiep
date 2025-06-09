import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
 import { useFocusEffect } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {fetchRapChieu} from '../redux/actions/RapChieuAction';
import {fetchPhim} from '../redux/actions/PhimAction';
import {fetchAllPhongChieu} from '../redux/actions/PhongChieuAction';
import {fetchAllSuatChieu} from '../redux/actions/SuatChieuAction';
import {useNavigation} from '@react-navigation/native';

const LocationScreen = () => {
  const dispatch = useDispatch();
  const listRapChieu = useSelector(state => state.rapchieu.listrapchieu);
  const listPhim = useSelector(state => state.phim.listphim);
  const listSuatChieu = useSelector(state => state.suatchieu.listsuatchieu);
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchRapChieu());
    dispatch(fetchPhim());
    dispatch(fetchAllPhongChieu());
    dispatch(fetchAllSuatChieu());
  }, []);
 

useFocusEffect(
  React.useCallback(() => {
    setSelectedCinema(null);
    setLoading(false);
    // reset các state khác nếu cần
  }, [])
);

  // Khi chọn rạp thì loading
  const handlePickCinema = value => {
  setSelectedCinema(value);
  setLoading(true);
  // Nếu API hỗ trợ filter theo rạp, bạn có thể fetch lại dữ liệu ở đây
  dispatch(fetchAllPhongChieu());
  dispatch(fetchAllSuatChieu());
  setTimeout(() => setLoading(false), 400);
};

  // Lọc phim theo rạp đã chọn
  const filteredPhim = selectedCinema
    ? listPhim.filter(phim => {
        return listSuatChieu.some(suatchieu => {
          if (suatchieu.phim_id !== phim.phim_id) return false;
          const phong = listPhongChieu.find(
            phongchieu =>
              phongchieu.room_id === suatchieu.room_id &&
              phongchieu.cinema_id === selectedCinema,
          );
          return !!phong;
        });
      })
    : [];

  return (
    <View style={{flex: 1, padding: 16, backgroundColor: 'white'}}>
      <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>
        Chọn địa chỉ rạp:
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#ddd',
          marginBottom: 16,
        }}>
        <Picker selectedValue={selectedCinema} onValueChange={handlePickCinema}>
          <Picker.Item label="Chọn rạp..." value={null} />
          {listRapChieu.map(item => (
            <Picker.Item
              key={item.cinema_id}
              label={`${item.ten_rap} - ${item.dia_chi}`}
              value={item.cinema_id}
            />
          ))}
        </Picker>
      </View>

      {selectedCinema && (
        <>
          <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 16}}>
            Phim tại{' '}
            {listRapChieu.find(r => r.cinema_id === selectedCinema)?.ten_rap ||
              ''}
            :
          </Text>
          {loading ? (
            <View style={{alignItems: 'center', marginTop: 20}}>
              <ActivityIndicator size="large" color="#EA5A5A" />
              <Text>Đang tải phim...</Text>
            </View>
          ) : filteredPhim.length === 0 ? (
            <Text>Không có phim nào ở rạp này.</Text>
          ) : (
            <FlatList
              data={filteredPhim}
              keyExtractor={item => item.phim_id}
              numColumns={2}
              renderItem={({item}) => (
                <View style={styles.card}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChiTietPhimUser', {
                        phim: item,
                        cinema_id: selectedCinema,
                      });
                    }}
                    style={{margin: 5}}
                    activeOpacity={0.8}>
                    <View style={styles.posterWrapper}>
                      <Image
                        style={styles.poster}
                        source={{uri: item.poster_url}}
                      />
                    </View>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.ten_phim}
                    </Text>
                    <Text style={styles.duration}>{item.thoi_luong} phút</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowRadius: 6,
    paddingBottom: 10,
    padding: 5,
    height: 330,
    margin: 5,
  },
  posterWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  poster: {
    width: 200,
    height: '100%',
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
    minHeight: 36,
  },
  duration: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
  },
});
