import {Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Image} from 'react-native';
import React, {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/UserReducer';
const api_khach_hang = 'https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang';

const Login = () => {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [mat_khau, setMatKhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handAnim = useRef(new Animated.Value(1)).current;

  const toggleShowPassword = () => {
    Animated.timing(handAnim, {
      toValue: showPassword ? 1 : 0, // 1: ẩn mật khẩu (hiện kính), 0: hiện mật khẩu (ẩn kính)
      duration: 250,
      useNativeDriver: false,
    }).start();
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !mat_khau) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      const res = await fetch(api_khach_hang);
      const users = await res.json();
      const user = users.find(
        u => u.email === email && u.mat_khau === mat_khau,
      );
      if (user) {
        dispatch(setUser(user))
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        nav.navigate('MyTabs');
      } else {
        Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra!');
    }
  };


  return (
    <View style={st.khung}>
       <View style={{width: 300, height: 400, alignItems: 'center', justifyContent: 'center'}}>
      <Image style={{width: 300, height: 400, position: 'absolute'}} source={require('../img/loginavatar2.png')} />
      {/* Kính trái */}
      <Animated.View style={{
        position: 'absolute',
        top: 80,
        left: 95,
        width: 45,
        height: 30,
        backgroundColor: 'black',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        opacity: handAnim, // opacity động
      }} />
      {/* Kính phải */}
      <Animated.View style={{
        position: 'absolute',
       
        top: 80,
        left: 160,
        width: 45,
        height: 30,
        backgroundColor: 'black',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        opacity: handAnim, // opacity động
      }} />
      <Image style={{position:'absolute' , bottom:showPassword?'-130':'200',left:-55}} source={showPassword ? require('../img/mouth.png') : require('../img/mouth2.png')}/>
    </View>
      <Text style={st.text}>Đăng nhập</Text>
      <View style={[st.textInput, {flexDirection: 'row', alignItems: 'center'}]}>
        <Icon size={30} style={{width: 30}} color="#666" name="user" />
        <TextInput
          style={{marginLeft: 10, width: '100%'}}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
      </View>
      <View style={[st.textInput, {flexDirection: 'row', alignItems: 'center'}]}>
        <Icon size={30} style={{width: 30}} color="#666" name="lock" />
        <TextInput
          style={{marginLeft: 10, width: '80%'}}
          value={mat_khau}
          onChangeText={setMatKhau}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <Icon
            name={showPassword ? 'eye' : 'eye-slash'}
            size={24}
            color="#666"
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={{color: '#373FE2', margin: 20,textDecorationLine:'underline'}}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} style={{backgroundColor: '#BB0000', width: '85%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 50}}>
        <Text style={{color: 'white'}}>Đăng nhập</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
        <View style={st.line} />
        <Text style={{}}>Hoặc đăng nhập với</Text>
        <View style={st.line} />
      </View>
      <TouchableOpacity onPress={() => {
          nav.navigate('Register');
        }} style={{backgroundColor: 'white', width: '85%', height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 50}}>
        <Text style={{color: 'black'}}>Đăng ký tài khoản Movix</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Login;

const st = StyleSheet.create({
  khung: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    width: 450,
    height: 65,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
  },
    line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
});
