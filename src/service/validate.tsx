import {Alert} from 'react-native';

export const validateEmail = (email: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface ValidateInputParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const ValidateInput = (
  firstName: ValidateInputParams['firstName'],
  lastName: ValidateInputParams['lastName'],
  email: ValidateInputParams['email'],
  phone: ValidateInputParams['phone'],
): boolean => {
  if (firstName.length === 0) {
    Alert.alert('Error', 'Please enter first name');
    return false;
  }
  if (lastName.length === 0) {
    Alert.alert('Error', 'Please enter last name');
    return false;
  }
  if (email.length === 0) {
    Alert.alert('Error', 'Please enter email');
    return false;
  }
  if (!validateEmail(email)) {
    Alert.alert('Error', 'Please enter valid email');
    return false;
  }
  if (phone.length === 0) {
    Alert.alert('Error', 'Please enter phone number');
    return false;
  }
  if (phone.length !== 10) {
    Alert.alert('Error', 'Please enter valid phone number');
    return false;
  }
  return true;
};
