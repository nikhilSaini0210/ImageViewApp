import {Alert, Animated, Image, Keyboard, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import CustomHeader from '@components/CustomHeader';
import CustomInput from '@components/CustomInput';
import CustomSafeAreaView from '@components/CustomSafeAreaView';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomButton from '@components/CustomButton';
import {savePost} from '@service/apiServices';
import {goBack} from '@utils/NavigationUtils';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import {ValidateInput} from '@service/validate';

const DetailsScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const routes = useRoute();
  const {item} = routes?.params as any;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);

      if (!ValidateInput(firstName, lastName, email, phone)) {
        return;
      }

      const data = {
        firstName,
        lastName,
        email,
        phone,
        xt_image: item?.xt_image,
      };

      const res = await savePost(data);
      if (res?.status === 'success') {
        Alert.alert('Success', 'Data saved successfully!');
        goBack();
      } else {
        Alert.alert('Error', 'Failed to save data');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyboardOffsetHeight === 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -keyboardOffsetHeight * 0.05,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [animatedValue, keyboardOffsetHeight]);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={'Detail Screen'} />
      <CustomSafeAreaView>
        <Animated.ScrollView
          bounces={false}
          style={{transform: [{translateY: animatedValue}]}}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps="handled">
          <View style={styles.subContainer}>
            <View style={styles.imageConatiner}>
              <Image
                source={{
                  uri: item.xt_image,
                }}
                style={[
                  styles.image,
                  item?.aspectRatio ? {aspectRatio: item.aspectRatio} : {},
                ]}
              />
            </View>

            <CustomInput
              onChangeText={setFirstName}
              value={firstName}
              left={
                <Icon
                  name="person"
                  color={'#F8890E'}
                  style={styles.icon}
                  size={RFValue(18)}
                />
              }
              placeholder="First Name"
              inputMode="text"
              right={false}
            />
            <CustomInput
              onChangeText={setLastName}
              value={lastName}
              left={
                <Icon
                  name="person"
                  color={'#F8890E'}
                  style={styles.icon}
                  size={RFValue(18)}
                />
              }
              placeholder="Last Name"
              inputMode="text"
              right={false}
            />
            <CustomInput
              onChangeText={setEmail}
              value={email}
              left={
                <Icon
                  name="mail"
                  color={'#F8890E'}
                  style={styles.icon}
                  size={RFValue(18)}
                />
              }
              placeholder="Email"
              inputMode="email"
              right={false}
            />
            <CustomInput
              onChangeText={text => setPhone(text.slice(0, 10))}
              value={phone}
              left={
                <Icon
                  name="phone-portrait"
                  color={'#F8890E'}
                  style={styles.icon}
                  size={RFValue(18)}
                />
              }
              placeholder="Phone"
              inputMode="numeric"
              right={false}
            />

            <CustomButton
              disabled={false}
              title="Submit"
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </Animated.ScrollView>
      </CustomSafeAreaView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginLeft: 10,
  },
  imageConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    // backgroundColor: Colors.primary,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
});
