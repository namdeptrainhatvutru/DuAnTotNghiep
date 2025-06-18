import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-native';
import {updateUser} from '../redux/actions/UserAction';
import {useNavigation} from '@react-navigation/native';

const ChangePass = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [OldPassword, setOldPassword] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [NewPassword2, setNewPassword2] = useState('');
  const navigation = useNavigation();
  const changepass = () => {
    if (OldPassword == '' || NewPassword == '' || NewPassword2 == '') {
      Alert.alert('Vui lòng nhập đầy đủ');
      return;
    } else if (NewPassword != NewPassword2) {
      Alert.alert('Pass mới ko giống nhau');
      return;
    }

    if (OldPassword == user.mat_khau) {
      dispatch(updateUser({...user, mat_khau: NewPassword})).then(() => {
        Alert.alert('Đổi pas thành công');
        navigation.reset({
          index: 0,
          routes: [{name: 'MyTabs'}],
        });
      });
    } else {
      Alert.alert('Sai pass cũ');
    }
  };
  return (
    <View>
      <Text>ChangePass</Text>
      <TextInput
        placeholder="Mật khẩu cũ"
        onChangeText={setOldPassword}
        value={OldPassword}
      />
      <TextInput
        placeholder="Mật khẩu mới"
        onChangeText={setNewPassword}
        value={NewPassword}
      />
      <TextInput
        placeholder="Xác nhận mật khẩu mới"
        onChangeText={setNewPassword2}
        value={NewPassword2}
      />
      <Button title="Xác nhận" onPress={changepass} />
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({});
