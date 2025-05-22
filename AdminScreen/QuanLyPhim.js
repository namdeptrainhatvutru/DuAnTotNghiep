import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPhim} from '../redux/actions/PhimAction';
import YoutubePlayer from 'react-native-youtube-iframe';
import WebView from 'react-native-webview';
import {Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QuanLyPhim = () => {
  const navigation = useNavigation();
  const listphim = useSelector(state => state.phim.listphim);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPhim, setSelectedPhim] = React.useState(null);
  const trailerUrl = 'https://www.youtube.com/watch?v=vO58-WSuDZU';
  const getYouTubeEmbedUrl = url => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };
  useEffect(() => {
    dispatch(fetchPhim());
  }, []);
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('ChiTietPhim', { phim: item });
      }}>
      <View style={styles.card}>
        <View style={styles.posterWrapper}>
          <Image style={styles.poster} source={{uri: item.poster_url}} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.ten_phim}
        </Text>
        <Text style={styles.duration}>{item.thoi_luong} phút</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        numColumns={2}
        data={listphim}
        keyExtractor={item => item.phim_id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default QuanLyPhim;

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
    paddingBottom: 40,
  },
  webview: {
    width: 500,
    height: 180,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: '#000',
  },
  card: {
    flex: 1 / 2,
    margin: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    paddingBottom: 10,
    minWidth: 150,
    padding: 5,
    position: 'relative',
    height: 350,
  },
  posterWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  ageTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
    width: 40,
  },
  ageText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#222',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
    minHeight: 36,
  },
  duration: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    maxHeight: '90%',
  },
  modalPoster: {
    width: 180,
    height: 260,
    borderRadius: 10,
    marginBottom: 14,
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
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#EA5A5A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  trailer: {
    width: 320,
    height: 180,
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: '#000',
  },
});
