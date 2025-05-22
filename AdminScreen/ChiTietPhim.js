import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const getYouTubeEmbedUrl = url => {
  if (!url) return '';
  const videoId = url.split('v=')[1];
  return `https://www.youtube.com/embed/${videoId}`;
};

const ChiTietPhim = ({ route }) => {
  const { phim } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.modalScroll}>
      <View style={styles.modalContent}>
        <Image style={styles.modalPoster} source={{ uri: phim.poster_url }} />
        <View style={{ width: '100%', maxWidth: 320, alignItems: 'center', marginBottom: 10 }}>
          <WebView
            source={{ uri: getYouTubeEmbedUrl(phim.trailer_url) }}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            style={styles.webview}
          />
        </View>
        <Text style={styles.modalTitle}>{phim.ten_phim}</Text>
        <Text style={styles.modalLabel}>
          Đạo diễn: <Text style={styles.modalValue}>{phim.dao_dien}</Text>
        </Text>
        <Text style={styles.modalLabel}>
          Thể loại: <Text style={styles.modalValue}>{phim.the_loai}</Text>
        </Text>
        <Text style={styles.modalLabel}>
          Ngôn ngữ: <Text style={styles.modalValue}>{phim.ngon_ngu}</Text>
        </Text>
        <Text style={styles.modalLabel}>
          Độ tuổi: <Text style={styles.modalValue}>{phim.do_tuoi}+</Text>
        </Text>
        <Text style={styles.modalLabel}>
          Thời lượng: <Text style={styles.modalValue}>{phim.thoi_luong} phút</Text>
        </Text>
        <Text style={styles.modalLabel}>Mô tả:</Text>
        <Text style={styles.modalDesc}>{phim.mo_ta}</Text>
      </View>
    </ScrollView>
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
});