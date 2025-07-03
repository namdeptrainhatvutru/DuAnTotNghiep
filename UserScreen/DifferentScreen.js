import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const DifferentScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Tài khoản của bạn</Text>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('KhoVe')}>
          <Text style={styles.buttonText}>Kho vé của bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('KhoVoucher')}>
          <Text style={styles.buttonText}>Kho voucher của bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Chatbot')}>
          <Text style={styles.buttonText}>Chat bot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('ChangePass')}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={()=>
          navigation.reset({index:0,routes: [{name: 'Login'}],})
        }>
          <Text style={[styles.buttonText, {color:'#fff'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DifferentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#EA5A5A',
    marginTop: 8,
  },
});