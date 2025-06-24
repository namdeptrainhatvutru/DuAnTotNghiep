import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';
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
    <View>
      <TextInput
        placeholder="tên phim"
        value={ten_phim}
        onChangeText={setten_phim}
      />
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        <TextInput
          placeholder="poster"
          value={poster_url}
          onChangeText={setposter_url}
          style={{flex: 1, borderBottomWidth: 1, marginRight: 8}}
        />
        <Button title="Chọn ảnh" onPress={handlePickImage} />
      </View>
      {poster_url ? (
        <Image
          source={{uri: poster_url}}
          style={{width: 80, height: 120, borderRadius: 8, marginBottom: 8}}
        />
      ) : null}
      <TextInput
        placeholder="trailer"
        value={trailer_url}
        onChangeText={settrailer_url}
      />
      <TextInput
        placeholder="đạo diễn"
        value={dao_dien}
        onChangeText={setdao_dien}
      />
      <TextInput
        placeholder="thể loại"
        value={the_loai}
        onChangeText={setthe_loai}
      />
      <TextInput
        placeholder="thời lượng"
        value={thoi_luong}
        onChangeText={setthoi_luong}
      />
      <TextInput placeholder="mô tả" value={mo_ta} onChangeText={setmo_ta} />
      <TextInput
        placeholder="ngôn ngữ"
        value={ngon_ngu}
        onChangeText={setngon_ngu}
      />
      <TextInput
        placeholder="độ tuổi"
        value={do_tuoi}
        onChangeText={setdo_tuoi}
      />
      <Button title="thêm" onPress={handleAddPhim} />
    </View>
  );
};

export default AddPhim;

const styles = StyleSheet.create({});
