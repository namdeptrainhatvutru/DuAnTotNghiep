import React, {useState} from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

const StaffScreen = () => {
  const device = useCameraDevice('back');
  const [isScanning, setIsScanning] = useState(true);
  const [qrInfo, setQrInfo] = useState(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      for (const code of codes) {
        setIsScanning(false);
        try {
          setQrInfo(JSON.parse(code.value));
        } catch (e) {
          setQrInfo({error: 'Không phát hiện QR hợp lệ'});
        }
      }
    },
  });

  if (device == null) {
    return (
      <View style={styles.centered}>
        <Text>Không có camera</Text>
      </View>
    );
  }

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
      <View style={styles.infoContainer}>
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
        <Text style={{color: '#fff'}}>
          Trạng thái:{' '}
          {qrInfo && qrInfo.ngay_chieu
            ? new Date(qrInfo.ngay_chieu.split('/').reverse().join('-')) <
              new Date()
              ? 'Quá hạn'
              : 'Còn hạn'
            : ''}
        </Text>

        {!isScanning && (
          <View style={{marginTop: 20}}>
            <Text
              style={styles.scanAgainButton}
              onPress={() => {
                setIsScanning(true);
                setQrInfo(null);
              }}>
              Quét tiếp
            </Text>
          </View>
        )}
      </View>
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
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
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
});
