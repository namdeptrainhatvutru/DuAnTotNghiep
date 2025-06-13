import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllPhongChieu} from '../redux/actions/PhongChieuAction';
import {fetchRapChieu} from '../redux/actions/RapChieuAction';
import QRCode from 'react-native-qrcode-svg';
import {fetchGheByRoomId, updateNhieuGhe} from '../redux/actions/GheAction';
import {useNavigation} from '@react-navigation/native';
import {addVe} from '../redux/actions/VeAction';
import {tangDiemUser} from '../redux/actions/UserAction';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ThongTinVe = ({route}) => {
  const {suatChieu, phim} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listRapChieu = useSelector(state => state.rapchieu.listrapchieu);
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);
  const listghe = useSelector(state => state.ghe.listghe);
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(true);
  const [gheSelected, setGheSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllPhongChieu());
      await dispatch(fetchRapChieu());
      await dispatch(fetchGheByRoomId(suatChieu.room_id));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSelectGhe = vi_tri => {
    setGheSelected(prev =>
      prev.includes(vi_tri)
        ? prev.filter(g => g !== vi_tri)
        : [...prev, vi_tri],
    );
  };

  const phongchieu = listPhongChieu.find(
    phong => phong.room_id == suatChieu.room_id,
  );
  const rapchieu = phongchieu
    ? listRapChieu.find(rap => rap.cinema_id == phongchieu.cinema_id)
    : null;

  if (loading || !phongchieu || !rapchieu) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông tin vé...</Text>
      </View>
    );
  }

  const sortedGhe = [];
  const seen = new Set();
  [...listghe]
  .filter(ghe => ghe.suat_chieu_id === suatChieu.suat_chieu_id)
    .sort((a, b) => {
      const numA = parseInt(a.vi_tri.replace('G', ''), 10);
      const numB = parseInt(b.vi_tri.replace('G', ''), 10);
      return numA - numB;
    })
    .forEach(ghe => {
      const key = ghe.room_id + '-' + ghe.vi_tri;
      if (!seen.has(key)) {
        sortedGhe.push(ghe);
        seen.add(key);
      }
    });

  const thongTinVe = {
    khach_hang_id: user.khach_hang_id,
    ten_phim: phim.ten_phim,
    ngay_chieu: suatChieu.ngay_chieu,
    gio_chieu: `${suatChieu.thoi_gian_bat_dau}h - ${suatChieu.thoi_gian_ket_thuc}h`,
    ten_phong: phongchieu?.ten_phong,
    dia_chi_rap: rapchieu?.dia_chi,
    vi_tri_ghe: gheSelected.join(','),
    trang_thai: 'chưa sử dụng',
  };
  thongTinVe.ma_qr = JSON.stringify(thongTinVe);

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 120}}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Thông tin vé</Text>
        <Text>Tên phim: {thongTinVe.ten_phim}</Text>
        <Text>Ngày chiếu: {thongTinVe.ngay_chieu}</Text>
        <Text>Giờ chiếu: {thongTinVe.gio_chieu}</Text>
        <Text>Phòng chiếu: {thongTinVe.ten_phong}</Text>
        <Text>Rạp: {thongTinVe.dia_chi_rap}</Text>
        <Text>Số ghế: {thongTinVe.vi_tri_ghe}</Text>

        <View style={{flexDirection: 'row', marginRight: 20, marginTop: 10}}>
          <Text style={{fontSize:10}}>Đang chọn :</Text>
          <View style={styles.boxRed} />
          <Text style={{fontSize:10}}> Trống :</Text>
          <View style={styles.boxWhite} />
          <Text style={{fontSize:10}}>Đã hết :</Text>
          <View style={styles.boxPurple} />
        </View>

        <View style={{marginVertical: 20}}>
          <Text style={{fontWeight: 'bold'}}>Danh sách ghế:</Text>
          <View style={styles.phongchieu}>
            <Text style={{color: 'white', fontSize: 15, fontStyle: 'italic'}}>
              Màn hình chiếu
            </Text>
            <Svg height="60" width="100%" viewBox="0 0 300 60">
  {/* Lớp glow mờ ngoài cùng */}
  <Path
    d="M10 50 Q 150 0 290 50"
    stroke="#A6A7E0"
    strokeWidth="20"
    strokeOpacity="0.2"
    fill="none"
    strokeLinecap="round"
  />
  {/* Lớp glow mờ bên trong */}
  <Path
    d="M10 50 Q 150 0 290 50"
    stroke="#8889D6"
    strokeWidth="14"
    strokeOpacity="0.4"
    fill="none"
    strokeLinecap="round"
  />
  {/* Lớp glow đậm gần trong */}
  <Path
    d="M10 50 Q 150 0 290 50"
    stroke="#6E70CC"
    strokeWidth="10"
    strokeOpacity="0.6"
    fill="none"
    strokeLinecap="round"
  />
  {/* Lớp chính sáng nhất */}
  <Path
    d="M10 50 Q 150 0 290 50"
    stroke="#696ACD"
    strokeWidth="6"
    fill="none"
    strokeLinecap="round"
  />
</Svg>

            <View style={{alignItems: 'center', marginTop: 40}}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                {sortedGhe.map((gheItem, index) => {
                  const isSelected = gheSelected.includes(gheItem.vi_tri);
                  const isBooked = gheItem.trang_thai !== 'trống';
                  return (
                    <TouchableOpacity
                      key={gheItem.room_id + '-' + gheItem.vi_tri}
                      onPress={() =>
                        !isBooked && handleSelectGhe(gheItem.vi_tri)
                      }
                      disabled={isBooked}
                      activeOpacity={isBooked ? 1 : 0.7}>
                      <View
                        style={{
                          borderWidth: 2,
                          borderRadius: 10,
                          padding: 2,
                          width: 80,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: 4,
                          backgroundColor: isBooked
                            ? '#4C4F90'
                            : isSelected
                            ? 'red'
                            : 'transparent',
                          borderColor: isBooked ? '#4C4F90' : 'red',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: isSelected ? 'bold' : 'normal',
                          }}>
                          {gheItem.vi_tri}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          backgroundColor: gheSelected.length === 0 ? 'gray' : 'red',
          padding: 20,
          borderRadius: 15,
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
        }}
        disabled={gheSelected.length === 0}
        onPress={async () => {
          navigation.navigate('VeCuaBan', {
            thongTinVe: thongTinVe,
            qrData: thongTinVe.ma_qr,
          });
          await dispatch(updateNhieuGhe({listghe, gheSelected}));
          await dispatch(addVe(thongTinVe));
          await dispatch(tangDiemUser(user));
          ToastAndroid.show('Tích điểm: +10 điểm', ToastAndroid.SHORT);
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
          Thanh toán: {gheSelected.length * 129000} đ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThongTinVe;

const styles = StyleSheet.create({
  phongchieu: {
    backgroundColor: '#2A2A38',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  boxRed: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: 'red',
    borderColor: 'red',
  },
  boxWhite: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderColor: 'red',
    backgroundColor:'#4C4F90'
  },
  boxPurple: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#4C4F90',
    borderColor: '#4C4F90',
  },
});
