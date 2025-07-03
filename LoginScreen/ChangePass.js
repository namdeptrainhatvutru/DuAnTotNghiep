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
    <View style={{flex: 1, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        width: '90%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: '#EA5A5A',
          marginBottom: 24,
          textAlign: 'center',
        }}>
          Đổi mật khẩu
        </Text>
        <TextInput
          placeholder="Mật khẩu cũ"
          onChangeText={setOldPassword}
          value={OldPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Mật khẩu mới"
          onChangeText={setNewPassword}
          value={NewPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Xác nhận mật khẩu mới"
          onChangeText={setNewPassword2}
          value={NewPassword2}
          secureTextEntry
          style={styles.input}
        />
        <View style={{height: 16}} />
        <Button title="Xác nhận" color="#EA5A5A" onPress={changepass} />
      </View>
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
    width: 250,
  },
});
