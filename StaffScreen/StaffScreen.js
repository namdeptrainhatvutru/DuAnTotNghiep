import React, {useState} from 'react';
import {SafeAreaView, Text, View, StyleSheet, Image, ScrollView} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useDispatch } from 'react-redux';
import { updateTrangThaiVe } from '../redux/actions/VeAction';
import BASE from '../config/BaseUrl';

const StaffScreen = () => {
  const device = useCameraDevice('back');
  const [isScanning, setIsScanning] = useState(true);
  const [qrInfo, setQrInfo] = useState(null);
  const [foodOrdered, setFoodOrdered] = useState([]);
  console.log('qrInfo:', qrInfo);
  console.log('foodOrdered:', foodOrdered);


  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      for (const code of codes) {
        setIsScanning(false);
        try {
          const qrData = JSON.parse(code.value);
          setQrInfo(qrData);
          console.log('QR Data:', qrData);

          // Lấy thông tin đồ ăn sau khi quét QR
          fetchFoodByTicket(qrData);
        } catch (e) {
          setQrInfo({error: 'Không phát hiện QR hợp lệ'});
        }
      }
    },
  });

  // Hàm lấy đồ ăn theo vé
  const fetchFoodByTicket = async (qrData) => {
    try {
      console.log('QR Data:', qrData); // Debug QR
      
      // 1. Lấy khach_hang_id từ vé
      const veResponse = await fetch(`http://${BASE}:3000/ve/${qrData.ve_id}`);
      const veData = await veResponse.json();
      
      console.log('Ve Data:', veData); // Debug vé data
      console.log('Khach hang ID:', veData?.khach_hang_id); // Debug khach_hang_id
      
      // Kiểm tra khach_hang_id có tồn tại không
      if (!veData || veData.khach_hang_id === undefined || veData.khach_hang_id === null) {
        console.log('Không tìm thấy khach_hang_id trong vé');
        setFoodOrdered([]);
        return;
      }

      // 2. Lấy danh sách đồ ăn
      const foodResponse = await fetch('https://688253a466a7eb81224e3f86.mockapi.io/doan/food');
      const foodData = await foodResponse.json();

      console.log('Food Data:', foodData); // Debug food data

      // 3. Lọc đồ ăn của khách hàng đúng ngày và đúng giờ chiếu
      const gioChieuVe = qrData.gio_chieu?.split('h')[0]?.trim(); // "22" từ "22h - 23h"

      const todayFood = foodData
        .map(food => {
          if (!Array.isArray(food.khach_hang_id)) return null;
          // Lọc các order đúng ve_id
          const orders = food.khach_hang_id.filter(order =>
            String(order.ve_id) === String(qrData.ve_id)
          );
          if (orders.length === 0) return null;
          // Trả về object gồm info món ăn và tổng số lượng
          return {
            ...food,
            so_luong: orders.reduce((sum, o) => sum + (o.so_luong || 1), 0),
            gio_chieu_list: orders.map(o => o.gio_chieu)
          };
        })
        .filter(Boolean);

      setFoodOrdered(todayFood);
    } catch (error) {
      console.error('Lỗi lấy thông tin đồ ăn:', error);
      setFoodOrdered([]);
    }
  };

  if (device == null) {
    return (
      <View style={styles.centered}>
        <Text>Không có camera</Text>
      </View>
    );
  }

  // Thêm nút xác nhận sử dụng vé
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          codeScanner={isScanning ? codeScanner : undefined}
        />
      </View>
      <ScrollView 
        style={styles.infoContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.infoTitle}>Thông tin QR:</Text>
        
        <Text style={{color: '#fff'}}>
          Phim : {qrInfo ? qrInfo.ten_phim : ''}
        </Text>
        <Text style={{color: '#fff'}}>
          Tên phòng : {qrInfo ? qrInfo.ten_phong : ''}
        </Text>
        <Text style={{color: '#fff'}}>
          Vị trí ghế : {qrInfo ? qrInfo.vi_tri_ghe : ''}
        </Text>
        <Text style={{color: '#fff'}}>
          Ngày chiếu : {qrInfo ? qrInfo.ngay_chieu : ''}
        </Text>
        <Text style={{color: '#fff'}}>
          Địa chỉ : {qrInfo ? qrInfo.dia_chi_rap : ''}
        </Text>
        <Text style={{color: '#fff'}}>
          Giờ chiếu : {qrInfo ? qrInfo.gio_chieu : ''}
        </Text>

        {/* Hiển thị đồ ăn đã đặt */}
        {foodOrdered.length > 0 && (
          <View style={styles.foodContainer}>
            <Text style={styles.foodTitle}>Đồ ăn đã đặt:</Text>
            {foodOrdered.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>• {food.name}</Text>
                  <Text style={styles.foodPrice}>{food.price}đ</Text>
                  <Text style={{color:'#fff'}}>Số lượng: {food.so_luong}</Text>
                  
                </View>
                <Image style={{width:100,height:100,borderRadius:8}} source={{uri:food.image}}/>
              </View>
            ))}
          </View>
        )}

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Trạng thái:</Text>
          <Text style={[
            styles.statusValue, 
            {
              backgroundColor: qrInfo?.trang_thai === 'đã sử dụng' ? '#ff4444' : 
                              qrInfo?.trang_thai === 'chưa sử dụng' ? '#44ff44' : '#ffaa44',
              color: '#fff'
            }
          ]}>
            {qrInfo?.trang_thai || 'Không xác định'}
          </Text>
        </View>

        {qrInfo && qrInfo.ve_id && (
          <View style={{marginTop: 20}}>
            <Text
              style={styles.scanAgainButton}
              onPress={async () => {
                try {
                  console.log('Đang cập nhật vé:', qrInfo.ve_id);
                  
                  const url = `http://${BASE}:3000/ve/${qrInfo.ve_id}`;
                 
                  
                  // Gọi API trực tiếp
                  const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      trang_thai: 'đã sử dụng'
                    })
                  });
                  
                  const result = await response.json();
                  console.log('Kết quả API:', result);
                  
                  if (response.ok) {
                    setQrInfo({ ...qrInfo, trang_thai: 'đã sử dụng' });
                    alert('Cập nhật thành công!');
                  } else {
                    alert('Lỗi API: ' + result.message);
                  }
                } catch (error) {
                  console.error('Lỗi cập nhật vé:', error);
                  alert('Lỗi: ' + error.message);
                }
              }}
            >
              Xác nhận vé đã sử dụng
            </Text>
          </View>
        )}

        {!isScanning && (
          <View style={{marginTop: 20, marginBottom: 30}}>
            <Text
              style={styles.scanAgainButton}
              onPress={() => {
                setIsScanning(true);
                setQrInfo(null);
                setFoodOrdered([]);
              }}>
              Quét tiếp
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StaffScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  cameraContainer: {
    height: 250,
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  camera: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#EA5A5A',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    textAlign: 'center',
    overflow: 'hidden',
  },
  foodContainer: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
    marginRight: 10,
  },
  foodName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodPrice: {
    color: '#ffdd44',
    fontSize: 14,
    fontWeight: 'bold',
  },
  foodTotal: {
    color: '#44ff44',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
  foodTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
