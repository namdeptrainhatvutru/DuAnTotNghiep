import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPhim} from '../redux/actions/PhimAction';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BannerSlider from '../redux/actions/BannerAction';
import {fetchVoucher} from '../redux/actions/VoucherAction';
import { fetchAllSuatChieu } from '../redux/actions/SuatChieuAction';

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const user = useSelector(state => state.user.user);
  const user_id = useSelector(state => state.user.user.khach_hang_id);
  const listvoucher = useSelector(state => state.voucher.listvoucher);
  const listphim = useSelector(state => state.phim.listphim);
  const listsuatchieu = useSelector(
    state => Array.isArray(state.suatchieu.listsuatchieu) ? state.suatchieu.listsuatchieu : []
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [selectedNgay, setSelectedNgay] = useState('Tất cả');

  //phần animation
  // Dùng để điều chỉnh chiều cao (hoặc transform)


  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    dispatch(fetchPhim());
    dispatch(fetchVoucher());
    dispatch(fetchAllSuatChieu())
  }, [dispatch]);
  
  const listvoucherbyid = listvoucher.filter(
    item => item.khach_hang_id === user_id.toString(),
  );
  // Lấy danh sách thể loại duy nhất từ listphim
  const genres = useMemo(() => [
    'Tất cả',
    ...Array.from(new Set(listphim.map(item => item.the_loai))),
  ], [listphim]);

  // Lọc phim theo thể loại đã chọn
  const filteredPhim = useMemo(() =>
    selectedGenre === 'Tất cả'
      ? listphim
      : listphim.filter(item => item.the_loai === selectedGenre)
  , [listphim, selectedGenre]);

  // Lấy danh sách ngày duy nhất có suất chiếu
  const ngaySuatchieuList = useMemo(() => [
    'Tất cả',
    ...Array.from(new Set(listsuatchieu.map(item => item.ngay_chieu))),
  ], [listsuatchieu]);

  // Lọc phim theo ngày chiếu (nếu chọn "Tất cả" thì không lọc)
  const filteredPhimByNgay = useMemo(() =>
    selectedNgay === 'Tất cả'
      ? filteredPhim
      : filteredPhim.filter(phim =>
          listsuatchieu.some(
            sc => sc.phim_id === phim.phim_id && sc.ngay_chieu === selectedNgay,
          ),
        )
  , [filteredPhim, listsuatchieu, selectedNgay]);

  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChiTietPhimUser', {phim: item});
          }}
          style={{margin: 5}}
          activeOpacity={0.8}>
          <View style={styles.card}>
            <View style={styles.posterWrapper}>
              <View
                style={{
                  backgroundColor: item.do_tuoi < 18 ? '#99FF66' : 'red',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 2,
                  width: 70,
                  marginTop: 10,
                  right: 0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}>
                <Text style={{fontSize: 10}}>{item.do_tuoi}+</Text>
              </View>
              <Image style={styles.poster} source={{uri: item.poster_url}} />
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {item.ten_phim}
            </Text>
            <Text style={styles.duration}>{item.thoi_luong} phút</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setSelectedGenre('Tất cả');
      setSelectedNgay('Tất cả');
      dispatch(fetchAllSuatChieu())
    }, [])
  );

  return (
    <View style={{padding: 10, backgroundColor: 'white', height: '100%'}}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{flexDirection: 'row'}}>
        <Image
          style={{width: 55, height: 55, marginRight: 10}}
          source={require('../img/profile.png')}
        />
        <View>
          <Text>Xin chào {user.ho_ten} !</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '55%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 90,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../img/member.png')}
              />
              <Text style={{fontSize: 8}}>member</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 50,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../img/diem.png')}
              />
              <Text style={{fontSize: 8}}>{user.diem}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: 50,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../img/voucher.png')}
              />
              <Text style={{fontSize: 8}}>{listvoucherbyid.length}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Animated.FlatList
        data={filteredPhimByNgay}
        keyExtractor={item => item.phim_id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <Animated.View
            style={{
              opacity: headerOpacity,
              transform: [{translateY: headerTranslateY}],
            }}>
            
    

                
            <View>
              <BannerSlider />
            </View>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <FlatList
                data={genres}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => setSelectedGenre(item)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor:
                        selectedGenre === item ? '#EA5A5A' : '#eee',
                      borderRadius: 20,
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        color: selectedGenre === item ? '#fff' : '#333',
                        fontWeight: 'bold',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <FlatList
                data={ngaySuatchieuList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => setSelectedNgay(item)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor:
                        selectedNgay === item ? '#EA5A5A' : '#eee',
                      borderRadius: 20,
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        color: selectedNgay === item ? '#fff' : '#333',
                        fontWeight: 'bold',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Animated.View>
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    // marginTop: 150,
  },
  card: {
    width: 150,
    alignItems: 'center',
    backgroundColor: 'white',

    shadowRadius: 6,
    paddingBottom: 10,
    padding: 5,
    height: 330,
  },
  posterWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
});
