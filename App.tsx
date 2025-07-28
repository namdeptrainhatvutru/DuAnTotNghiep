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
import { Alert, TouchableOpacity } from 'react-native';
import PhongChieu from './AdminScreen/PhongChieu';
import SuatChieu from './AdminScreen/SuatChieu';
import QuanLyPhim from './AdminScreen/QuanLyPhim';
import ChiTietPhim from './AdminScreen/ChiTietPhim';
import AddPhim from './AdminScreen/AddPhim';
import CapNhatSuatChieu from './AdminScreen/CapNhatSuatChieu';
import ChiTietPhimUser from './UserScreen/ChiTietPhimUser';
import ThongTinVe from './UserScreen/ThongTinVe';
import VeCuaBan from './UserScreen/VeCuaBan';
import KhoVe from './UserScreen/KhoVe';
import KhoVoucher from './UserScreen/KhoVoucher';
import Profile from './UserScreen/Profile';
import ChangePass from './LoginScreen/ChangePass';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ManHinhChao from './LoginScreen/ManHinhChao';
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
        tabBarLabelStyle: { fontSize: 7, },
        tabBarButton: (props) => {
          const { delayLongPress, ...rest } = props;
          const filteredProps = delayLongPress === null
            ? rest
            : { delayLongPress, ...rest };
          return (
            <TouchableOpacity activeOpacity={0.7} {...filteredProps}>
              {props.children}
            </TouchableOpacity>
          );
        },
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          if (route.name === 'Film') {
            iconName = 'film';
          } else if (route.name === 'Location') {
            iconName = 'location-arrow';
          } else if (route.name === 'Voucher') {
            iconName = 'ticket';
          } else if (route.name === 'Tin tức') {
            iconName = 'gift';
          } else if (route.name === 'Khác') {
            iconName = 'info-circle';
          }
          return (
            <Icon
              name={iconName}
              size={focused ? 25 : 20}
              color={focused ? 'red' : 'gray'}
              style={{ opacity: focused ? 2 : 0.5 }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Film" options={{
        headerShown: false
      }} component={HomeScreen} />
      <Tab.Screen name="Location" options={{
        headerShown: true
        , headerTitle: 'Location', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#8B0000' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={LocationScreen} />
      <Tab.Screen name="Voucher" options={{
        headerShown: true
        , headerTitle: 'Voucher', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#8B0000' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={VoucherScreen} />
      <Tab.Screen name="Tin tức" options={{
        headerShown: true
        , headerTitle: 'Tin tức', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#8B0000' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={PromotionalScreen} />
      <Tab.Screen name="Khác" options={{
        headerShown: true
        , headerTitle: 'Khác', headerTitleAlign: 'center', headerStyle: { backgroundColor: '#8B0000' }, headerTintColor: 'white', headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }} component={DifferentScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ManHinhChao">
          <Stack.Screen
            name="ManHinhChao"
            component={ManHinhChao}
            options={{ headerShown: false }}
          />
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
          <Stack.Screen
            name="PhongChieu"
            component={PhongChieu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SuatChieu"
            component={SuatChieu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuanLyPhim"
            component={QuanLyPhim}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChiTietPhim"
            component={ChiTietPhim}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddPhim"
            component={AddPhim}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CapNhatSuatChieu"
            component={CapNhatSuatChieu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChiTietPhimUser"
            component={ChiTietPhimUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ThongTinVe"
            component={ThongTinVe} />
          <Stack.Screen name="VeCuaBan"
            component={VeCuaBan} />
        
            <Stack.Screen name="KhoVe"
              component={KhoVe}
              options={{ headerShown: false }} />
     

          <Stack.Screen name="KhoVoucher"
            component={KhoVoucher} 
            options={{ headerShown: false }} />
          <Stack.Screen name="Profile"
            component={Profile} />
          <Stack.Screen name="ChangePass"
            component={ChangePass} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </Provider>
  );
};

export default App;