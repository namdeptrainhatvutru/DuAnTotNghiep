import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchSuatChieuByPhimId } from '../redux/actions/SuatChieuAction';

const ChiTietPhimUser = ({ route }) => {
  const { phim, cinema_id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const listSuatChieu = useSelector(state => state.suatchieu.listsuatchieu);
  const listPhongChieu = useSelector(state => state.phongchieu.listphongchieu);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchSuatChieuByPhimId(phim.phim_id));
  }, []);

  const getYouTubeEmbedUrl = url => {
    if (!url) return '';
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
  };

  const suatChieuRender = useMemo(() => {
    if (!Array.isArray(listSuatChieu)) return [];
    if (cinema_id) {
      return listSuatChieu.filter(
        suat =>
          suat.phim_id === phim.phim_id &&
          listPhongChieu.find(
            phong =>
              phong.room_id === suat.room_id &&
              phong.cinema_id === cinema_id
          )
      );
    }
    return listSuatChieu.filter(suat => suat.phim_id === phim.phim_id);
  }, [listSuatChieu, listPhongChieu, cinema_id, phim.phim_id]);

  const handleDatVe = () => {
    if (!selected) {
      alert('Vui lòng chọn suất chiếu!');
      return;
    }
    navigation.navigate('ThongTinVe', {
      suatChieu: selected,
      phim,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.trailerContainer}>
          <WebView
            source={{ uri: getYouTubeEmbedUrl(phim.trailer_url) }}
            style={styles.webview}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
          />
        </View>

        <View style={styles.posterWrapper}>
          <Image source={{ uri: phim.poster_url }} style={styles.poster} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{phim.ten_phim}</Text>
            <Text style={styles.subtitle}>{phim.thoi_luong} phút | {phim.do_tuoi}+</Text>
            <Text style={styles.genre}>{phim.the_loai}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionText}>{phim.mo_ta}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 Chọn suất chiếu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suatChieuRender.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelected(item)}
                style={[
                  styles.showtimeButton,
                  selected === item && styles.selectedShowtime,
                ]}>
                <Text style={styles.showtimeText}>
                  {item.thoi_gian_bat_dau}h - {item.thoi_gian_ket_thuc}h
                </Text>
                <Text style={styles.showtimeDate}>{item.ngay_chieu}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Đạo diễn:</Text><Text>{phim.dao_dien}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Ngôn ngữ:</Text><Text>{phim.ngon_ngu}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Thể loại:</Text><Text>{phim.the_loai}</Text></View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: selected ? '#e74c3c' : '#ccc' }]}
          onPress={handleDatVe}
          disabled={!selected}>
          <Text style={styles.buttonText}>Đặt vé</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChiTietPhimUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  trailerContainer: {
    height: 230,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  posterWrapper: {
    marginTop: -60,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  genre: {
    fontSize: 12,
    marginTop: 6,
    color: '#444',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  showtimeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
    marginRight: 10,
  },
  selectedShowtime: {
    backgroundColor: '#fdecea',
    borderColor: '#e74c3c',
  },
  showtimeText: {
    fontWeight: '500',
    fontSize: 14,
  },
  showtimeDate: {
    fontSize: 12,
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
