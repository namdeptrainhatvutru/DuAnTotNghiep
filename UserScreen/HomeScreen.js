import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhim } from '../redux/actions/PhimAction';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);
  const listphim = useSelector(state => state.phim.listphim);
  const dispatch = useDispatch();
  const navigation = useNavigation()

  useEffect(() => {
    dispatch(fetchPhim());
  }, [dispatch]);

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity onPress={()=>{navigation.navigate('ChiTietPhimUser',{phim : item})}} style={{ margin: 5 }} activeOpacity={0.8}>
          <View style={styles.card}>
            <View style={styles.posterWrapper}>
              <Image style={styles.poster} source={{ uri: item.poster_url }} />
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {item.ten_phim}
            </Text>
            <Text style={styles.duration}>{item.thoi_luong} Phút</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ padding: 10,backgroundColor:'white',height:'100%' }}>
      <Text>Xin chào {user.ho_ten} !</Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '55%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 90 }}>
          <Image style={{ width: 20, height: 20 }} source={require('../img/member.png')} />
          <Text style={{ fontSize: 8 }}>member</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 50 }}>
          <Image style={{ width: 20, height: 20 }} source={require('../img/diem.png')} />
          <Text style={{ fontSize: 8 }}>{user.diem}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 50 }}>
          <Image style={{ width: 20, height: 20 }} source={require('../img/voucher.png')} />
          <Text style={{ fontSize: 8 }}>0</Text>
        </View>
      </View>
      <View style={{width:'100%',height:150,backgroundColor:'lightgray',borderRadius:20,justifyContent:'center',alignItems:'center',marginBottom:10,marginTop:10}}>
        <Text>Banner</Text>
      </View>
      <View>
        <FlatList
          numColumns={3}
          data={listphim}
          keyExtractor={item => item.phim_id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
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