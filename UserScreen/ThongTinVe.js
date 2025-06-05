import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPhongChieu } from '../redux/actions/PhongChieuAction';
import { fetchRapChieu } from '../redux/actions/RapChieuAction';
import QRCode from 'react-native-qrcode-svg';

const ThongTinVe = ({route}) => {
  const {suatChieu, phim} = route.params;
  const dispatch = useDispatch();
  const listRapChieu = useSelector(state => state.rapchieu.listrapchieu);
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchData = async () => {
      await dispatch(fetchAllPhongChieu());
      await dispatch(fetchRapChieu());
      setLoading(false);
    };
    fetchData();
  },[]);

  const phongchieu = listPhongChieu.find((phong)=> phong.room_id == suatChieu.room_id);
  const rapchieu = phongchieu ? listRapChieu.find((rap)=> rap.cinema_id == phongchieu.cinema_id) : null;

  if (loading || !phongchieu || !rapchieu) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông tin vé...</Text>
      </View>
    );
  }

  const thongTinVe = {
    ten_phim: phim.ten_phim,
    ngay_chieu: suatChieu.ngay_chieu,
    gio_chieu: `${suatChieu.thoi_gian_bat_dau}h - ${suatChieu.thoi_gian_ket_thuc}h`,
    ten_phong: phongchieu?.ten_phong,
    dia_chi_rap: rapchieu?.dia_chi,
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
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <QRCode value={qrData} size={200} />
      </View>
    </View>
  );
};

export default ThongTinVe;
