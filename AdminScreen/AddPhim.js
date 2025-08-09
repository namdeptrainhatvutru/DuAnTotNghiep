import {Button, Image, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addPhim} from '../redux/actions/PhimAction';
import {launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

const THE_LOAI_OPTIONS = [
  'Hành động',
  'Phiêu lưu',
  'Hài',
  'Tình cảm / Lãng mạn',
  'Tâm lý',
  'Kinh dị',
  'Giật gân',
  'Bí ẩn',
  'Khoa học viễn tưởng',
  'Viễn tưởng - Giả tưởng',
  'Hình sự',
  'Chiến tranh',
  'Chính kịch',
  'Tài liệu',
  'Phim tiểu sử',
  'Âm nhạc',
  'Gia đình',
  'Thể thao',
  'Phim thiếu nhi',
];

const AddPhim = () => {
  const [ten_phim, setten_phim] = useState('');
  const [dao_dien, setdao_dien] = useState('');
  const [ngon_ngu, setngon_ngu] = useState('');
  const [do_tuoi, setdo_tuoi] = useState('');
  const [mo_ta, setmo_ta] = useState('');
  const [thoi_luong, setthoi_luong] = useState('');
  const [poster_url, setposter_url] = useState('');
  const [trailer_url, settrailer_url] = useState('');
  const [the_loai, setthe_loai] = useState('');

  const navigation = useNavigation()
  const imgbbApiKey = 'd698d3c569cf045e45516a8fc568c999';

  const uploadToImgbb = async base64 => {
    const formData = new FormData();
    formData.append('key', imgbbApiKey);
    formData.append('image', base64);
    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data?.url;
  };

  const handlePickImage = async () => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true},
      async response => {
        if (response.didCancel || response.errorCode) return;
        const base64 = response.assets[0].base64;
        const url = await uploadToImgbb(base64);
        if (url) {
          setposter_url(url);
        }
      },
    );
  };

  const dispatch = useDispatch();
  const handleAddPhim = () => {
    const phim = {
      ten_phim,
      dao_dien,
      ngon_ngu,
      do_tuoi,
      mo_ta,
      thoi_luong,
      poster_url,
      trailer_url,
      the_loai,
    };
    dispatch(addPhim(phim));
    navigation.goBack()
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#f4f6fb'}}>
      <View style={styles.container}>
        <Text style={styles.title}>Thêm phim mới</Text>

        <Text style={styles.label}>Tên phim</Text>
        <TextInput
          placeholder="Nhập tên phim"
          value={ten_phim}
          onChangeText={setten_phim}
          style={styles.input}
        />

        <Text style={styles.label}>Poster phim</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <TextInput
            placeholder="Dán link poster hoặc chọn ảnh"
            value={poster_url}
            onChangeText={setposter_url}
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TouchableOpacity
            style={styles.pickImageBtn}
            onPress={handlePickImage}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>
        {poster_url ? (
          <Image
            source={{ uri: poster_url }}
            style={styles.posterPreview}
          />
        ) : null}

        <Text style={styles.label}>Trailer (YouTube)</Text>
        <TextInput
          placeholder="Link trailer"
          value={trailer_url}
          onChangeText={settrailer_url}
          style={styles.input}
        />

        <Text style={styles.label}>Đạo diễn</Text>
        <TextInput
          placeholder="Nhập tên đạo diễn"
          value={dao_dien}
          onChangeText={setdao_dien}
          style={styles.input}
        />

        <Text style={styles.label}>Thể loại</Text>
        <View style={[styles.input, {padding: 0, marginBottom: 14, backgroundColor: '#fff'}]}>
          <Picker
            selectedValue={the_loai}
            onValueChange={setthe_loai}
            style={{height: 48}}
            dropdownIconColor="#EA5A5A"
          >
            <Picker.Item label="Chọn thể loại..." value="" />
            {THE_LOAI_OPTIONS.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Thời lượng (phút)</Text>
        <TextInput
          placeholder="VD: 120"
          value={thoi_luong}
          onChangeText={setthoi_luong}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          placeholder="Mô tả phim"
          value={mo_ta}
          onChangeText={setmo_ta}
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          multiline
        />

        <Text style={styles.label}>Ngôn ngữ</Text>
        <TextInput
          placeholder="Ngôn ngữ phim"
          value={ngon_ngu}
          onChangeText={setngon_ngu}
          style={styles.input}
        />

        <Text style={styles.label}>Độ tuổi</Text>
        <TextInput
          placeholder="VD: 16"
          value={do_tuoi}
          onChangeText={setdo_tuoi}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddPhim}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Thêm phim</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddPhim;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    margin: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
    marginLeft: 2,
    marginTop: 8,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  pickImageBtn: {
    backgroundColor: '#EA5A5A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  posterPreview: {
    width: 130,
    height: 190,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f4f4f4',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtn: {
    backgroundColor: '#EA5A5A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#EA5A5A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
