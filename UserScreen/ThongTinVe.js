import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllPhongChieu} from '../redux/actions/PhongChieuAction';
import {fetchRapChieu} from '../redux/actions/RapChieuAction';
import QRCode from 'react-native-qrcode-svg';
import {fetchGheByRoomId} from '../redux/actions/GheAction';

const ThongTinVe = ({route}) => {
  const {suatChieu, phim} = route.params;
  const dispatch = useDispatch();
  const listRapChieu = useSelector(state => state.rapchieu.listrapchieu);
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);
  const listghe = useSelector(state => state.ghe.listghe);
  console.log(listghe);

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
    setGheSelected(
      prev =>
        prev.includes(vi_tri)
          ? prev.filter(g => g !== vi_tri) // bỏ chọn nếu đã chọn
          : [...prev, vi_tri], // thêm nếu chưa chọn
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

  // Sắp xếp ghế theo số thứ tự trong vi_tri (G1, G2, ..., G30)
  const sortedGhe = [...listghe].sort((a, b) => {
    const numA = parseInt(a.vi_tri.replace('G', ''), 10);
    const numB = parseInt(b.vi_tri.replace('G', ''), 10);
    return numA - numB;
  });
  const thongTinVe = {
    ten_phim: phim.ten_phim,
    ngay_chieu: suatChieu.ngay_chieu,
    gio_chieu: `${suatChieu.thoi_gian_bat_dau}h - ${suatChieu.thoi_gian_ket_thuc}h`,
    ten_phong: phongchieu?.ten_phong,
    dia_chi_rap: rapchieu?.dia_chi,
    vi_tri_ghe: gheSelected.join(','),
  };
  const qrData = JSON.stringify(thongTinVe);

  return (
    <View style={{padding: 20}}>
      <Text style={{fontWeight: 'bold', fontSize: 18}}>Thông tin vé</Text>
      <Text>Tên phim: {thongTinVe.ten_phim}</Text>
      <Text>Ngày chiếu: {thongTinVe.ngay_chieu}</Text>
      <Text>Giờ chiếu: {thongTinVe.gio_chieu}</Text>
      <Text>Phòng chiếu: {thongTinVe.ten_phong}</Text>
      <Text>Rạp: {thongTinVe.dia_chi_rap}</Text>
      <Text>Số ghế: {thongTinVe.vi_tri_ghe}</Text>
      {/* <View style={{alignItems: 'center', marginVertical: 20}}>
        <QRCode value={qrData} size={200} />
      </View> */}

      <View style={{marginVertical: 20}}>
        <Text style={{fontWeight: 'bold'}}>Danh sách ghế:</Text>
        {/* Căn giữa danh sách ghế */}
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {sortedGhe.map((gheItem, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectGhe(gheItem.vi_tri)}>
                <View
                  style={{
                    borderWidth: gheSelected.includes(gheItem.vi_tri) ? 3 : 1,
                    borderRadius: 10,
                    padding: 2,
                    width: 80,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 4,
                    backgroundColor:
                      gheItem.trang_thai == 'trống' ? 'white' : 'red',
                    borderColor: gheSelected.includes(gheItem.vi_tri)
                      ? 'red'
                      : 'black',
                  }}>
                  <Text>{gheItem.vi_tri}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
  style={{
    backgroundColor: gheSelected.length ==0? 'gray':'red',
    padding: 20,
    borderRadius: 15,
    position: 'absolute',
    // bottom: 30,
    alignSelf: 'center',
  }}
  disabled={gheSelected.length ==0? true: false}
>
  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
    Thanh toán: {gheSelected.length * 129000} đ
  </Text>
</TouchableOpacity>
    </View>
  );
};

export default ThongTinVe;
