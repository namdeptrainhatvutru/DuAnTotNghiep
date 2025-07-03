import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllPhongChieu} from '../redux/actions/PhongChieuAction';
import {fetchRapChieu} from '../redux/actions/RapChieuAction';
import QRCode from 'react-native-qrcode-svg';
import {fetchGheByRoomId, updateNhieuGhe} from '../redux/actions/GheAction';
import {useNavigation} from '@react-navigation/native';
import {addVe} from '../redux/actions/VeAction';
import {tangDiemUser} from '../redux/actions/UserAction';
import {StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {deleteVoucher, fetchVoucher} from '../redux/actions/VoucherAction';
import {addThanhToan} from '../redux/actions/ThanhToanAction';
import Modal from 'react-native-modal';

const ThongTinVe = ({route}) => {
  const {suatChieu, phim} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user_id = useSelector(state => state.user.user.khach_hang_id);
  const listvoucher = useSelector(state => state.voucher.listvoucher);
  const listRapChieu = useSelector(state => state.rapchieu.listrapchieu);
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);
  const listghe = useSelector(state => state.ghe.listghe);
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(true);
  const [gheSelected, setGheSelected] = useState([]);
  const [payment, setPayment] = useState('');
  const [voucherSelected, setVoucherSelected] = useState(null);
  const [showVietQR, setShowVietQR] = useState(false);
  const listvoucherbyid = listvoucher.filter(
    item => item.khach_hang_id === user_id.toString(),
  );
  const giamGia = voucherSelected?.giam_gia || 0;

  const so_tien =
    gheSelected.length * 80000 - ((gheSelected.length * 80000) / 100) * giamGia;
  const now = new Date();
  const ngay_mua =
    String(now.getDate()).padStart(2, '0') +
    '/' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '/' +
    now.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllPhongChieu());
      await dispatch(fetchRapChieu());
      await dispatch(fetchGheByRoomId(suatChieu.room_id));
      setLoading(false);
    };
    fetchData();
    if (user_id) {
      dispatch(fetchVoucher());
    }
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

  // Thông tin chuyển khoản VietQR
  const vietQRInfo = {
    accountName: 'VU HOANG NAM',
    accountNumber: '9961062156',
    bankCode: 'VCB', 
    so_tien: so_tien,
    noiDung: `MOVIX_${user.khach_hang_id}_${Date.now()}`,
  };

  // Link ảnh QR từ vietqr.io (không cần tự tạo QR code)
  const vietQRUrl = `https://img.vietqr.io/image/${vietQRInfo.bankCode}-${
    vietQRInfo.accountNumber
  }-compact2.png?amount=${vietQRInfo.so_tien}&addInfo=${encodeURIComponent(
    vietQRInfo.noiDung,
  )}&accountName=${encodeURIComponent(vietQRInfo.accountName)}`;

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 120}}>
        <View style={styles.ticketCard}>
          <Text style={styles.ticketTitle}>Thông tin vé</Text>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Tên phim:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.ten_phim}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Ngày chiếu:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.ngay_chieu}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Suất chiếu:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.gio_chieu}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Phòng chiếu:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.ten_phong}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Rạp:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.dia_chi_rap}</Text>
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Số ghế:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.vi_tri_ghe}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginRight: 20, marginTop: 10}}>
          <Text style={{fontSize: 10}}>Đang chọn :</Text>
          <View style={styles.boxRed} />
          <Text style={{fontSize: 10}}> Trống :</Text>
          <View style={styles.boxWhite} />
          <Text style={{fontSize: 10}}>Đã hết :</Text>
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
        {Array.isArray(listvoucherbyid) && listvoucherbyid.length > 0 && (
          <View>
            <Text>Giảm giá :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listvoucherbyid.map((voucher, index) => (
                <TouchableOpacity
                  onPress={() => setVoucherSelected(voucher)}
                  key={index}
                  style={{
                    borderWidth: 2,
                    padding: 10,
                    marginRight: 10,
                    borderColor:
                      voucherSelected?.voucher_id?.toString() ===
                      voucher?.voucher_id?.toString()
                        ? 'red'
                        : 'black',
                  }}>
                  <Text>{voucher.giam_gia}%</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <View
          style={{borderWidth: 1, margin: 10, backgroundColor: 'black'}}></View>
        <View>
          <Text>Giá vé : {gheSelected.length * 80000}đ</Text>
          <Text>Giảm giá : - {giamGia}đ</Text>
        </View>
        <View
          style={{borderWidth: 1, margin: 10, backgroundColor: 'black'}}></View>
        <View style={{height: 300}}>
          <TouchableOpacity
            onPress={() => {
              setPayment('Momo');
            }}
            style={[
              styles.payment,
              {
                borderColor: payment === 'Momo' ? 'red' : 'black',
                borderWidth: payment === 'Momo' ? 2 : 1,
              },
            ]}>
            <Image
              style={styles.imgpayment}
              source={require('../img/momo.png')}
            />
            <Text>Momo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPayment('Thẻ tín dụng');
            }}
            style={[
              styles.payment,
              {
                borderColor: payment === 'Thẻ tín dụng' ? 'red' : 'black',
                borderWidth: payment === 'Thẻ tín dụng' ? 2 : 1,
              },
            ]}>
            <Image
              style={styles.imgpayment}
              source={require('../img/card.png')}
            />
            <Text>Thẻ tín dụng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPayment('VietQR')}
            style={[
              styles.payment,
              {
                borderColor: payment === 'VietQR' ? 'red' : 'black',
                borderWidth: payment === 'VietQR' ? 2 : 1,
              },
            ]}>
            <Image
              style={styles.imgpayment}
              source={require('../img/vietqr.png')}
            />
            <Text>VietQR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          backgroundColor:
            gheSelected.length === 0 || !payment ? 'gray' : 'red',
          padding: 20,
          borderRadius: 15,
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
        }}
        disabled={gheSelected.length === 0 || !payment}
        onPress={async () => {
          if (payment === 'VietQR') {
            setShowVietQR(true);
            return;
          }
          // 1. Đặt vé trước, lấy ve_id
          const veRes = await dispatch(addVe(thongTinVe));
          const ve_id = veRes.payload?.ve_id || veRes.payload?.id;

          // 2. Tạo object thanh toán
          const thanhToanData = {
            khach_hang_id: user.khach_hang_id,
            phuong_thuc: payment,
            so_tien: so_tien,
            ngay_mua: ngay_mua,
            ve_id: ve_id,
          };

          // 3. Gọi action thêm thanh toán
          const res = await dispatch(addThanhToan(thanhToanData));
          console.log('Kết quả thêm thanh toán:', res);

          // 4. Các thao tác khác
          dispatch(
            updateNhieuGhe({
              listghe,
              gheSelected,
              suat_chieu_id: suatChieu.suat_chieu_id,
            }),
          );
          await dispatch(tangDiemUser(user));
          ToastAndroid.show('Tích điểm: +10 điểm', ToastAndroid.SHORT);
          // 5. xóa voucher
          dispatch(deleteVoucher(voucherSelected?.voucher_id));

          navigation.navigate('VeCuaBan', {
            thongTinVe: thongTinVe,
            qrData: thongTinVe.ma_qr,
          });
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
          Thanh toán: {so_tien}đ
        </Text>
      </TouchableOpacity>

      {/* Modal hiển thị QR VietQR */}
      <Modal isVisible={showVietQR}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Quét mã VietQR để thanh toán</Text>
          <Image
            source={{ uri: vietQRUrl }}
            style={{ width: 220, height: 220, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, marginBottom: 6 }}>Số tiền: <Text style={{ fontWeight: 'bold' }}>{so_tien}đ</Text></Text>
          <Text style={{ fontSize: 14, marginBottom: 6 }}>Nội dung: <Text style={{ fontWeight: 'bold' }}>{vietQRInfo.noiDung}</Text></Text>
          <TouchableOpacity
            style={{ backgroundColor: 'red', padding: 12, borderRadius: 8, marginTop: 10, width: 180, alignItems: 'center' }}
            onPress={async () => {
              setShowVietQR(false);
              // Sau khi xác nhận đã chuyển khoản, thực hiện các bước đặt vé, thanh toán...
              // 1. Đặt vé trước, lấy ve_id
              const veRes = await dispatch(addVe(thongTinVe));
              const ve_id = veRes.payload?.ve_id || veRes.payload?.id;

              // 2. Tạo object thanh toán
              const thanhToanData = {
                khach_hang_id: user.khach_hang_id,
                phuong_thuc: payment,
                so_tien: so_tien,
                ngay_mua: ngay_mua,
                ve_id: ve_id,
              };

              // 3. Gọi action thêm thanh toán
              const res = await dispatch(addThanhToan(thanhToanData));
              // 4. Các thao tác khác
              dispatch(updateNhieuGhe({ listghe, gheSelected, suat_chieu_id: suatChieu.suat_chieu_id }))
              await dispatch(tangDiemUser(user));
              ToastAndroid.show('Tích điểm: +10 điểm', ToastAndroid.SHORT);
              dispatch(deleteVoucher(voucherSelected?.voucher_id))

              navigation.navigate('VeCuaBan', {
                thongTinVe: thongTinVe,
                qrData: thongTinVe.ma_qr,
              });
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Tôi đã chuyển khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => setShowVietQR(false)}
          >
            <Text style={{ color: 'gray' }}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    backgroundColor: '#4C4F90',
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
  payment: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 20,
    borderWidth: 1,
  },
  imgpayment: {width: 50, height: 50, marginRight: 10},
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  qrImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 12,
    textAlign: 'center',
  },
  ticketRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ticketLabel: {
    fontWeight: 'bold',
    color: '#333',
    width: 110,
  },
  ticketValue: {
    color: '#444',
    flex: 1,
  },
});
