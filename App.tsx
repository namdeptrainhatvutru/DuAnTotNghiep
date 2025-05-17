import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Provider } from 'react-redux';
import store from './redux/store/store';
import Login from './LoginScreen/Login';
import Icon from 'react-native-vector-icons/FontAwesome';
import Register from './LoginScreen/Register';
import HomeScreen from './UserScreen/HomeScreen';
import LocationScreen from './UserScreen/LocationScreen';
import VoucherScreen from './UserScreen/VoucherScreen';
import PromotionalScreen from './UserScreen/PromotionalScreen';
import DifferentScreen from './UserScreen/DifferentScreen';
import AdminScreen from './AdminScreen/AdminScreen';
import StaffScreen from './StaffScreen/StaffScreen';
import AddStaff from './AdminScreen/AddStaff';
import QuanLyVoucher from './AdminScreen/QuanLyVoucher';
import QuanLyRapChieu from './AdminScreen/QuanLyRapChieu';
import QuanLyKhachHang from './AdminScreen/QuanLyKhachHang';
import Chatbot from './UserScreen/Chatbot';
import { Alert } from 'react-native';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 14, },
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          if (route.name === 'Film') {
            iconName = 'film';
          } else if (route.name === 'Location') {
            iconName = 'location-arrow';
          } else if (route.name === 'Voucher') {
            iconName = 'ticket';
          } else if (route.name === 'Khuyến mãi') {
            iconName = 'gift';
          } else if (route.name === 'Khác') {
            iconName = 'info-circle';
          }
          return (
            <Icon
              name={iconName}
              size={focused ? 30 : 24}
              color={focused ? 'red' : 'gray'}
              style={{ opacity: focused ? 2 : 0.5 }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Film" options={{
        headerShown: true
        , headerTitle: 'Trang chủ', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#EA5A5A' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },headerRight:()=>(<Icon name="comments" size={25} color="black" style={{ marginRight: 10 }} onPress={() => Alert.alert('Chatbot')} />)
      }} component={HomeScreen} />
      <Tab.Screen name="Location" options={{
        headerShown: true
        , headerTitle: 'Location', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#EA5A5A' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={LocationScreen} />
      <Tab.Screen name="Voucher" options={{
        headerShown: true
        , headerTitle: 'Voucher', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#EA5A5A' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={VoucherScreen} />
      <Tab.Screen name="Khuyến mãi" options={{
        headerShown: true
        , headerTitle: 'Khuyến mãi', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#EA5A5A' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={PromotionalScreen} />
      <Tab.Screen name="Khác" options={{
        headerShown: true
        , headerTitle: 'Khác', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#EA5A5A' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={DifferentScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminScreen"
            component={AdminScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StaffScreen"
            component={StaffScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddStaff"
            component={AddStaff}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuanLyVoucher"
            component={QuanLyVoucher}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuanLyRapChieu"
            component={QuanLyRapChieu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuanLyKhachHang"
            component={QuanLyKhachHang}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chatbot"
            component={Chatbot}
            options={{ headerShown: false }}
          />


        </Stack.Navigator>
      </NavigationContainer>

    </Provider>
  );
};

export default App;