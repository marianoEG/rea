import React from 'react';
import { StyleSheet, Text, TextProps, View } from 'react-native';
import { Animated, Dimensions, PixelRatio } from 'react-native';
import WithAnimatedObject = Animated.WithAnimatedObject;

const { width, height } = Dimensions.get('window');
const scale = width / 411;

const Typography = (props: WithAnimatedObject<TextProps>) => {
  return <Animated.Text {...props} style={[styles.text, props.style]} />;
};

export default Typography;

const styles = StyleSheet.create({
  text: {
    //fontFamily: fonts['400'],
    //color: colors.text,
  },
});