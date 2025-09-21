import { Button, Image, Linking, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const ADMIN_BUTTONS = [
  [
    {
      label: 'Quản lý nhân viên',
      icon: require('../img/quanlyStaff.png'),
      onPress: nav => nav.navigate('AddStaff'),
    },
    {
      label: 'Quản lý Rạp chiếu',
      icon: require('../img/quanlycinema.png'),
      onPress: nav => nav.navigate('QuanLyRapChieu'),
    },
  ],
  [
    {
      label: 'Quản lý voucher',
      icon: require('../img/voucher.png'),
      onPress: nav => nav.navigate('QuanLyVoucher'),
    },
    {
      label: 'Quản lý khách hàng',
      icon: require('../img/users.png'),
      onPress: nav => nav.navigate('QuanLyKhachHang'),
    },
  ],
  [
    {
      label: 'Quản lý phim',
      icon: require('../img/phim.png'),
      onPress: nav => nav.navigate('QuanLyPhim'),
    },
    {
      label: 'Thống kê',
      icon: require('../img/static.png'),
      onPress: () => Linking.openURL('https://khadai126205.github.io/MD22_Movix/phim/phim.html'),
    },
  ],
];

const AdminScreen = () => {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang quản trị hệ thống</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ADMIN_BUTTONS.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((btn, idx) => (
              <TouchableOpacity
                key={btn.label}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => btn.onPress(nav)}
              >
                <View style={styles.iconWrapper}>
                  <Image source={btn.icon} style={styles.icon} />
                </View>
                <Text style={styles.cardLabel}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default AdminScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 22,
    gap: 18,
  },
  card: {
    backgroundColor: '#fff',
    width: 160,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconWrapper: {
    backgroundColor: '#fbe9e7',
    borderRadius: 50,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#EA5A5A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});