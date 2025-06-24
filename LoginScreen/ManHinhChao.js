import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Video from 'react-native-video';

const ManHinhChao = () => {
  const navigation = useNavigation();
  const api = 'https://67b5f43207ba6e59083f3354.mockapi.io/banner'
  const [banner,setBanner] = useState('')
  const getIMG = async ()=>{
    const res = await fetch(api)
    const data = await res.json()
    setBanner(data[0].banner)
    console.log(data[0].banner);
    
  }
  
  useEffect(() => {
    getIMG()
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={{flex:1}}>
      {banner ? (
        <Image source={{uri: banner}} style={{width: '100%', height: '100%'}} />
      ) : (
        <Video
          source={{ uri: 'https://www.dropbox.com/scl/fi/r1u7uc39datgro96pr3rn/Ghim-tr-n-H-nh-nh.mp4?rlkey=q2bri8tur1iwbwiponidrhjkw&st=l8nqsslc&dl=0' }} // Đường dẫn video của bạn
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          repeat
          muted
        />
      )}
    </View>
  )
}

export default ManHinhChao

const styles = StyleSheet.create({})