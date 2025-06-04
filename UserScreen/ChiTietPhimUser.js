import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSuatChieuByPhimId} from '../redux/actions/SuatChieuAction';

const ChiTietPhimUser = ({route}) => {
  const {phim} = route.params;
  const listSuatChieu = useSelector(state => state.suatchieu.listsuatchieu);
  const [selected,setSelected] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSuatChieuByPhimId(phim.phim_id));
  }, []);
  const getYouTubeEmbedUrl = url => {
    if (!url) return '';
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0`;
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <View
          style={{
            height: 280,
            alignItems: 'center',
            marginBottom: 10,
            borderWidth: 1,
          }}>
          <WebView
            source={{uri: getYouTubeEmbedUrl(phim.trailer_url)}}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
            style={styles.webview}
          />
        </View>
        <View>
          <Image style={styles.poster} source={{uri: phim.poster_url}} />
        </View>
        <View
          style={{
            borderWidth: 1,
            marginLeft: 190,
            width: 150,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: 5,
          }}>
          <Text style={{fontSize: 9}}> {phim.thoi_luong} phút</Text>
          
        </View>
        <View
          style={{
            marginTop: 80,
            margin: 20,
            height: 150,
            padding: 10,
            overflow: 'hidden',
          }}>
          <Text style={{color: 'gray', fontSize: 10}}>{phim.mo_ta}</Text>
        </View>
        <View style={{borderTopWidth: 1, paddingVertical: 10,padding:5}}>
          <Text style={{fontSize: 12, marginBottom: 5}}>Suất chiếu :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: 'row'}}>
              {listSuatChieu.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={()=>{
                    setSelected(item);
                    console.log('Selected Suat Chieu:', item);
                  }}
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 10,
                    marginRight: 10,
                    backgroundColor: selected === item ? '#d3d3d3' : '#f5f5f5',
                    minWidth: 100,
                    alignItems: 'center',
                  }}>
                  <Text>
                    {item.thoi_gian_bat_dau}h - {item.thoi_gian_ket_thuc}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{borderWidth: 1, borderColor: 'gray'}}></View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-around',
            }}>
            <Text style={{fontSize: 12}}>Độ tuổi : </Text>
            <Text style={{color: 'gray', marginLeft: 20, fontSize: 12}}>
              {phim.do_tuoi}+
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-around',
            }}>
            <Text style={{fontSize: 12}}>Đạo diễn : </Text>
            <Text style={{color: 'gray', marginLeft: 20, fontSize: 12}}>
              {phim.dao_dien}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-around',
            }}>
            <Text style={{fontSize: 12}}>Ngôn ngữ : </Text>
            <Text style={{color: 'gray', marginLeft: 20, fontSize: 12}}>
              {phim.ngon_ngu}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-around',
            }}>
            <Text style={{fontSize: 12}}>Thể loại : </Text>
            <Text style={{color: 'gray', marginLeft: 20, fontSize: 12}}>
              {phim.the_loai}
            </Text>
          </View>
        </View>
        <View style={{borderWidth: 1, borderColor: 'gray'}}></View>
        <View style={{height:300}}>
          <Text>Tin tức</Text>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          
        }}>
        <TouchableOpacity style={styles.button}>
          <Text style={{color: 'white'}}>Đặt vé</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChiTietPhimUser;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',

    width: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6, // Android
    height: 60,
    marginLeft: 20,
  },
  heartButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Đổ bóng
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6, // Android
    borderRadius: 5,
  },
  webview: {
    width: '500',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  poster: {
    width: 150,
    height: 250,
    borderRadius: 10,
    position: 'absolute',
    top: -130,
    marginLeft: 20,
    zIndex: 2,
  },
});
