import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import {useNavigation} from '@react-navigation/native';

const VeCuaBan = ({route}) => {
  const {thongTinVe, qrData} = route.params;
  const navigation = useNavigation();

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'MyTabs'}],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Thông tin vé của khách hàng</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tên phim:</Text>
          <Text style={styles.value}>{thongTinVe.ten_phim}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngày chiếu:</Text>
          <Text style={styles.value}>{thongTinVe.ngay_chieu}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Giờ chiếu:</Text>
          <Text style={styles.value}>{thongTinVe.gio_chieu}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phòng chiếu:</Text>
          <Text style={styles.value}>{thongTinVe.ten_phong}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Rạp:</Text>
          <Text style={styles.value}>{thongTinVe.dia_chi_rap}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số ghế:</Text>
          <Text style={styles.value}>{thongTinVe.vi_tri_ghe}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Mã vé:</Text>
          <Text style={styles.value}>{thongTinVe.ve_id}</Text>
        </View>
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <QRCode value={qrData} size={180} />
        </View>
        <Text style={styles.note}>Vui lòng lưu lại mã QR của bạn</Text>
        <Button
          title="Quay về trang chủ"
          color="#EA5A5A"
          onPress={handleBackToHome}
        />
      </View>
    </View>
  );
};

export default VeCuaBan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 18,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 90,
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#444',
  },
  note: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 16,
    fontSize: 13,
  },
});
