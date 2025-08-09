import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {useDispatch} from 'react-redux';
import {deletePhim, updatePhim} from '../redux/actions/PhimAction';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

const getYouTubeEmbedUrl = url => {
  if (!url) return '';
  const videoId = url.split('v=')[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0`;
};

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

const ChiTietPhim = ({route}) => {
  const {phim} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [editPhim, setEditPhim] = useState(phim);
  const [currentPhim, setCurrentPhim] = useState(phim); // Dùng state này để hiển thị

  const handleDelete = phim_id => {
    dispatch(deletePhim(phim_id)).then(() => {
      navigation.goBack();
    });
  };

  const handleUpdate = () => {
    dispatch(updatePhim(editPhim)).then(() => {
      setCurrentPhim(editPhim); // cập nhật lại phim hiển thị
      setModal(false);
    });
  };

  const handlePickImage = async () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, async response => {
      if (response.didCancel || response.errorCode) return;
      const base64 = response.assets[0].base64;
      // Upload lên imgbb
      const url = await uploadToImgbb(base64);
      if (url) {
        setEditPhim({...editPhim, poster_url: url});
      }
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
      <ScrollView contentContainerStyle={{padding: 24, alignItems: 'center'}}>
        <Image style={styles.modalPoster} source={{uri: currentPhim.poster_url}} />
        <Text style={styles.modalTitle}>{currentPhim.ten_phim}</Text>
        <View style={{width: '100%', maxWidth: 400, marginVertical: 10,alignItems:'center'}}>
          <WebView
            source={{uri: getYouTubeEmbedUrl(currentPhim.trailer_url)}}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
            style={styles.webview}
          />
        </View>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          width: '100%',
          maxWidth: 400,
          marginBottom: 18,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.06,
          shadowRadius: 3,
          elevation: 1,
        }}>
          <Text style={styles.modalLabel}>
            Đạo diễn: <Text style={styles.modalValue}>{currentPhim.dao_dien}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            Thể loại: <Text style={styles.modalValue}>{currentPhim.the_loai}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            Ngôn ngữ: <Text style={styles.modalValue}>{currentPhim.ngon_ngu}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            Độ tuổi: <Text style={styles.modalValue}>{currentPhim.do_tuoi}+</Text>
          </Text>
          <Text style={styles.modalLabel}>
            Thời lượng: <Text style={styles.modalValue}>{currentPhim.thoi_luong} phút</Text>
          </Text>
          <Text style={styles.modalLabel}>Mô tả:</Text>
          <Text style={styles.modalDesc}>{currentPhim.mo_ta}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', width: '100%', maxWidth: 400}}>
          <Button
            title="Xóa"
            color="#888"
            onPress={() => handleDelete(currentPhim.phim_id)}
          />
          <View style={{width: 16}} />
          <Button
            title="Cập nhật"
            color="#EA5A5A"
            onPress={() => setModal(true)}
          />
        </View>
      </ScrollView>

      {/* Modal cập nhật phim */}
      <Modal visible={modal} animationType="slide" transparent>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModal(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 20,
              minHeight: '70%',
              maxHeight: '90%',
            }}
            onPress={() => {}} // Ngăn sự kiện nổi bọt lên overlay
          >
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#EA5A5A',
              marginBottom: 18,
              textAlign: 'center',
            }}>
              Cập nhật phim
            </Text>
            <ScrollView>
              <TextInput
                placeholder="Tên phim"
                value={editPhim.ten_phim}
                onChangeText={text => setEditPhim({...editPhim, ten_phim: text})}
                style={styles.input}
              />
              <TextInput
                placeholder="Đạo diễn"
                value={editPhim.dao_dien}
                onChangeText={text => setEditPhim({...editPhim, dao_dien: text})}
                style={styles.input}
              />
              <TextInput
                placeholder="Ngôn ngữ"
                value={editPhim.ngon_ngu}
                onChangeText={text => setEditPhim({...editPhim, ngon_ngu: text})}
                style={styles.input}
              />
              <TextInput
                placeholder="Độ tuổi"
                value={editPhim.do_tuoi?.toString()}
                onChangeText={text => setEditPhim({...editPhim, do_tuoi: text})}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Mô tả"
                value={editPhim.mo_ta}
                onChangeText={text => setEditPhim({...editPhim, mo_ta: text})}
                style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
                multiline
              />
              <TextInput
                placeholder="Thời lượng"
                value={editPhim.thoi_luong?.toString()}
                onChangeText={text => setEditPhim({...editPhim, thoi_luong: text})}
                style={styles.input}
                keyboardType="numeric"
              />
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                <TextInput
                  placeholder="Poster URL"
                  value={editPhim.poster_url}
                  onChangeText={text => setEditPhim({...editPhim, poster_url: text})}
                  style={[styles.input, {flex: 1, marginRight: 8}]}
                />
                <Button title="Chọn ảnh" onPress={handlePickImage} />
              </View>
              {editPhim.poster_url ? (
                <Image
                  source={{ uri: editPhim.poster_url }}
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
                placeholder="Trailer URL"
                value={editPhim.trailer_url}
                onChangeText={text => setEditPhim({...editPhim, trailer_url: text})}
                style={styles.input}
              />
              {/* Thay TextInput thể loại bằng Picker */}
              <View style={[styles.input, {padding: 0, marginBottom: 8}]}>
                <Picker
                  selectedValue={editPhim.the_loai}
                  onValueChange={value => setEditPhim({...editPhim, the_loai: value})}
                  style={{height: 48}}
                >
                  <Picker.Item label="Chọn thể loại..." value="" />
                  {THE_LOAI_OPTIONS.map(option => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
              {/* Xóa hoặc comment TextInput thể loại cũ */}
              {/* 
              <TextInput
                placeholder="Thể loại"
                value={editPhim.the_loai}
                onChangeText={text => setEditPhim({...editPhim, the_loai: text})}
                style={styles.input}
              />
              */}
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24}}>
                <Button title="Cập nhật" color="#EA5A5A" onPress={handleUpdate} />
                <Button title="Đóng" color="#888" onPress={() => setModal(false)} />
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ChiTietPhim;

const styles = StyleSheet.create({
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    maxWidth: 400,
  },
  modalPoster: {
    width: 180,
    height: 260,
    borderRadius: 10,
    marginBottom: 14,
  },
  webview: {
    width: 500,
    height: 170,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 4,
    color: '#222',
  },
  modalValue: {
    fontWeight: 'normal',
    color: '#444',
  },
  modalDesc: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 8,
    padding: 6,
    borderRadius: 6,
  },
});
