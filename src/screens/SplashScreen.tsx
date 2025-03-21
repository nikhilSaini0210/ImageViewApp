import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import Logo from '@assets/images/logo.png';
import {Colors} from '@utils/Constants';
import {screenHeight, screenWidth} from '@utils/Scaling';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {Routes} from '@navigation/Routes';

const SplashScreen = () => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      resetAndNavigate(Routes.ImageScreen);
    }, 1500);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: screenHeight * 0.4,
    width: screenWidth * 0.4,
    resizeMode: 'contain',
  },
});
