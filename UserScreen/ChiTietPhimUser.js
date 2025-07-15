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
  const listGhe = useSelector(state => state.ghe.listghe); // Lấy danh sách ghế từ redux

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchSuatChieuByPhimId(phim.phim_id));
  }, []);

  const getYouTubeEmbedUrl = url => {
    if (!url) return '';
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
  };

  const isSuatChieuOver = (item) => {
    // item.ngay_chieu dạng 'dd/mm/yyyy'
    if (!item.ngay_chieu) return false;
    const [day, month, year] = item.ngay_chieu.split('/');
    const now = new Date();
    const ngayChieu = new Date(`${year}-${month}-${day}`);
    if (
      now.toDateString() !== ngayChieu.toDateString()
    ) {
      // Nếu ngày chiếu đã qua
      return now > ngayChieu;
    }
    // Nếu là hôm nay, kiểm tra giờ
    const nowHour = now.getHours();
    const gioKetThuc = parseInt(item.thoi_gian_ket_thuc, 10);
    return nowHour >= gioKetThuc;
  };

  // Hàm kiểm tra suất chiếu đã full ghế
  const isFullGhe = (suatChieuId, listghe) => {
    const gheOfSuat = listghe.filter(ghe => ghe.suat_chieu_id === suatChieuId);
    // Nếu không có ghế thì không full
    if (gheOfSuat.length === 0) return false;
    // Nếu tất cả ghế đều khác 'trống' thì full
    return gheOfSuat.every(ghe => ghe.trang_thai !== 'trống');
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
  }, [listSuatChieu, listPhongChieu, cinema_id, phim.phim_id, listGhe]);

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
          <View style={styles.trailerOverlay} />
          <WebView
            source={{ uri: getYouTubeEmbedUrl(phim.trailer_url) }}
            style={styles.webview}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <View style={styles.posterWrapper}>
          <Image source={{ uri: phim.poster_url }} style={styles.poster} />
          <View style={styles.infoCard}>
            <Text style={styles.title}>{phim.ten_phim}</Text>
            <Text style={styles.subtitle}>{phim.thoi_luong} phút | {phim.do_tuoi}+</Text>
            <Text style={styles.genre}>{phim.the_loai}</Text>
          </View>
        </View>
        

        

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 Chọn suất chiếu</Text>
          {suatChieuRender.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic', marginLeft: 8 }}>
              Không có suất chiếu
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suatChieuRender.map((item, index) => {
                if (isSuatChieuOver(item)) return null;
                const full = isFullGhe(item.suat_chieu_id, listGhe);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => !full && setSelected(item)}
                    disabled={full}
                    style={[
                      styles.showtimeButton,
                      selected === item && styles.selectedShowtime,
                      full && { backgroundColor: '#eee', borderColor: '#aaa' },
                    ]}>
                    <Text style={styles.showtimeText}>
                      {item.thoi_gian_bat_dau}h - {item.thoi_gian_ket_thuc}h
                    </Text>
                    <Text style={styles.showtimeDate}>{item.ngay_chieu}</Text>
                    {full && (
                      <View style={{
                        backgroundColor: '#e74c3c',
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginTop: 4,
                        alignSelf: 'center',
                      }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Đã hết ghế</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.infoCardDetail}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🎬</Text>
              <Text style={styles.infoLabel}>Đạo diễn:</Text>
              <Text style={styles.infoValue}>{phim.dao_dien}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🌐</Text>
              <Text style={styles.infoLabel}>Ngôn ngữ:</Text>
              <Text style={styles.infoValue}>{phim.ngon_ngu}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🏷️</Text>
              <Text style={styles.infoLabel}>Thể loại:</Text>
              <Text style={styles.infoValue}>{phim.the_loai}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.descCard}>
            <Text style={styles.sectionText}>{phim.mo_ta}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: selected ? '#8B0000' : '#ccc' }]}
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
  trailerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
    borderRadius: 16,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  infoCard: {
    flex: 1,
    marginLeft: 16,
    marginTop: 70,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
  showtimeOver: {
    backgroundColor: '#eee',
    borderColor: '#aaa',
  },
  showtimeText: {
    fontWeight: '500',
    fontSize: 14,
  },
  showtimeDate: {
    fontSize: 12,
    color: '#555',
  },
  infoCardDetail: {
    backgroundColor: '#f7f7fa',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#444',
    width: 90,
  },
  infoValue: {
    flex: 1,
    color: '#222',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
    borderRadius: 1,
  },
  descCard: {
    backgroundColor: '#fdf6f0',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
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
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
