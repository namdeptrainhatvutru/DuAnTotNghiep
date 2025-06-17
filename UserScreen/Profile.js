import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  console.log(user);
  const navigation = useNavigation();

  return (
    <View style={styles.khung}>
      <View>
        <Image
          style={{width: 150, height: 150, margin: 10}}
          source={require('../img/profile.png')}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.hoten}>{user.ho_ten}</Text>
        <Text>Thẻ thành viên</Text>
        <Image source={require('../img/thanhvien.png')} />
        <View
          style={{borderWidth: 1, width: '100%', borderColor: 'gray'}}></View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 50,
            }}>
            <Text style={{fontSize: 12}}>Tổng chỉ tiêu</Text>
            <Text>0đ</Text>
          </View>
          <View
            style={{borderWidth: 1, height: 100, borderColor: 'gray'}}></View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 50,
            }}>
            <Text style={{fontSize: 12}}>Điểm thưởng</Text>
            <Text>0</Text>
          </View>
        </View>
        <View
          style={{borderWidth: 1, width: '100%', borderColor: 'gray'}}></View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}], 
          });
        }}
        style={{
          justifyContent: 'center',
          backgroundColor: '#E28F1B',
          margin: 20,
          width: '100%',
          height: 70,
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Text style={{color: 'white'}}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  khung: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',

    padding: 20,
  },
  body: {
    backgroundColor: 'white',
    height: 500,
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  hoten: {
    fontWeight: '500',
    fontSize: 20,
  },
});
