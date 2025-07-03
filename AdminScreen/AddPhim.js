import {Button, Image, StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addPhim} from '../redux/actions/PhimAction';
import {launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

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
    <View style={{
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding: 20,
    }}>
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#EA5A5A',
          marginBottom: 18,
          textAlign: 'center',
        }}>
          Thêm phim mới
        </Text>
        <TextInput
          placeholder="Tên phim"
          value={ten_phim}
          onChangeText={setten_phim}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <TextInput
            placeholder="Link poster"
            value={poster_url}
            onChangeText={setposter_url}
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#EA5A5A',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}
            onPress={handlePickImage}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>
        {poster_url ? (
          <Image
            source={{ uri: poster_url }}
            style={{
              width: 120,
              height: 180,
              borderRadius: 10,
              alignSelf: 'center',
              marginBottom: 14,
              borderWidth: 1,
              borderColor: '#eee',
            }}
          />
        ) : null}
        <TextInput
          placeholder="Link trailer (YouTube)"
          value={trailer_url}
          onChangeText={settrailer_url}
          style={styles.input}
        />
        <TextInput
          placeholder="Đạo diễn"
          value={dao_dien}
          onChangeText={setdao_dien}
          style={styles.input}
        />
        <TextInput
          placeholder="Thể loại"
          value={the_loai}
          onChangeText={setthe_loai}
          style={styles.input}
        />
        <TextInput
          placeholder="Thời lượng (phút)"
          value={thoi_luong}
          onChangeText={setthoi_luong}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Mô tả"
          value={mo_ta}
          onChangeText={setmo_ta}
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          multiline
        />
        <TextInput
          placeholder="Ngôn ngữ"
          value={ngon_ngu}
          onChangeText={setngon_ngu}
          style={styles.input}
        />
        <TextInput
          placeholder="Độ tuổi"
          value={do_tuoi}
          onChangeText={setdo_tuoi}
          style={styles.input}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#EA5A5A',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 18,
          }}
          onPress={handleAddPhim}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Thêm phim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddPhim;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
});
