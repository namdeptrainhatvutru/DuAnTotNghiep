import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateSuatChieu} from '../redux/actions/SuatChieuAction';

const CapNhatSuatChieu = ({route, navigation}) => {
  const {phim, suat_chieu} = route.params;
  const dispatch = useDispatch();
  const listphim = useSelector(state => state.phim.listphim);

  // State cho các trường chỉnh sửa
  const [ngay_chieu, setngay_chieu] = useState(suat_chieu.ngay_chieu.toString());
  const [thoi_gian_bat_dau, setthoi_gian_bat_dau] = useState(suat_chieu.thoi_gian_bat_dau.toString());
  const [thoi_gian_ket_thuc, setthoi_gian_ket_thuc] = useState(suat_chieu.thoi_gian_ket_thuc.toString());
  const [phim_id, setphim_id] = useState(suat_chieu.phim_id);
  const [phimModal, setPhimModal] = useState(false);
  const [searchPhim, setSearchPhim] = useState('');

  const handleDateChange = text => {
    const cleaned = text.replace(/[^\d]/g, '');
    let formatted = '';
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    const parts = formatted.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (day > 31) parts[0] = '31';
    if (month > 12) parts[1] = '12';
    if (parts.length === 3) {
      formatted = `${parts[0]}/${parts[1]}/${parts[2]}`;
    } else if (parts.length === 2) {
      formatted = `${parts[0]}/${parts[1]}`;
    } else {
      formatted = parts[0];
    }
    setngay_chieu(formatted);
  };

  const handleUpdate = () => {
    const updated = {
      ...suat_chieu,
      ngay_chieu,
      thoi_gian_bat_dau,
      thoi_gian_ket_thuc,
      phim_id,
    };
    dispatch(updateSuatChieu(updated)).then(() => {
      Alert.alert('Cập nhật thành công!');
      navigation.goBack();
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#f8f8f8'}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Cập nhật suất chiếu</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ngày chiếu</Text>
          <TextInput
            placeholder="dd/mm/yyyy"
            value={ngay_chieu}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
            style={styles.input}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Thời gian bắt đầu</Text>
          <TextInput
            placeholder="Thời gian bắt đầu"
            value={thoi_gian_bat_dau}
            onChangeText={setthoi_gian_bat_dau}
            style={styles.input}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Thời gian kết thúc</Text>
          <TextInput
            placeholder="Thời gian kết thúc"
            value={thoi_gian_ket_thuc}
            onChangeText={setthoi_gian_ket_thuc}
            style={styles.input}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phim</Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => setPhimModal(true)}
          >
            <Text style={{color: phim_id ? '#222' : '#888'}}>
              {phim_id
                ? listphim.find(p => p.phim_id === phim_id)?.ten_phim || 'Chọn phim'
                : 'Chọn phim'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal chọn phim */}
      <Modal visible={phimModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
              <Text style={{fontWeight: 'bold', fontSize: 20, flex: 1}}>Chọn phim</Text>
              <TouchableOpacity onPress={() => setPhimModal(false)}>
                <Text style={{fontSize: 18, color: '#EA5A5A', fontWeight: 'bold'}}>Đóng</Text>
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
                  item.ten_phim.toLowerCase().includes(searchPhim.toLowerCase())
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
                      borderColor: phim_id === item.phim_id ? '#EA5A5A' : '#eee',
                      borderRadius: 10,
                      padding: 10,
                      backgroundColor: phim_id === item.phim_id ? '#FFF0F0' : '#fff',
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
                    <Text style={{
                      fontSize: 16,
                      fontWeight: phim_id === item.phim_id ? 'bold' : 'normal',
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
    </KeyboardAvoidingView>
  );
};

export default CapNhatSuatChieu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: 18,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 18,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#EA5A5A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#888',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    minHeight: '70%',
    maxHeight: '90%',
  },
});
