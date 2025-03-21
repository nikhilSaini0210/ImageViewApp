import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '@utils/NavigationUtils';
import { Routes } from './Routes';
import SplashScreen from '@screens/SplashScreen';
import ImageScreen from '@screens/ImageScreen';
import DetailsScreen from '@screens/DetailsScreen';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={Routes.Splash}>
        <Stack.Screen name={Routes.Splash} component={SplashScreen} />
        <Stack.Screen
          name={Routes.ImageScreen}
          component={ImageScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name={Routes.DetailsScreen}
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
