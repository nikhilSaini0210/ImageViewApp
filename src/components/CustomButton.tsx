import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import CustomText from './CustomText';
import {Colors, Fonts} from '@utils/Constants';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled: boolean;
  loading: boolean;
}

const CustomButton: FC<ButtonProps> = ({onPress, title, disabled, loading}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.btn,
        {
          backgroundColor: disabled ? Colors.disabled : Colors.secondary,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={'#fff'} size="small" />
      ) : (
        <CustomText
          style={styles.text}
          variant="h6"
          fontFamily={Fonts.SemiBold}>
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: '100%',
  },
  text: {
    color: '#fff',
  },
});
