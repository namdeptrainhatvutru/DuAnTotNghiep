import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Provider } from 'react-redux';
import store from './redux/store/store';
import Login from './LoginScreen/Login';
import Icon from 'react-native-vector-icons/FontAwesome';
import Register from './LoginScreen/Register';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'red', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: {
          backgroundColor:  'white', 
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
  }else if (route.name === 'Khác') {
    iconName = 'info-circle';
  }
  return (
    <Icon
      name={iconName}
      size={focused ? 30 : 24}
      color={focused ? 'red' : 'gray'}
      style={{ opacity: focused ? 1 : 0.5 }}
    />
  );
},
      })}
    >
      <Tab.Screen name="Film" options={{ headerShown: false }} component={Login} />
      <Tab.Screen name="Location" options={{ headerShown: false }} component={Login} />
      <Tab.Screen name="Voucher" options={{ headerShown: false }} component={Login} />
      <Tab.Screen name="Khuyến mãi" options={{ headerShown: false }} component={Login} />
      <Tab.Screen name="Khác" options={{ headerShown: false }} component={Login} />
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
         
          
        </Stack.Navigator>
      </NavigationContainer>

    </Provider>
  );
};

export default App;