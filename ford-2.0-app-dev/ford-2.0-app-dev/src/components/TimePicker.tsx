import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';

type Props = {
  title?: string;
  rippleColor?: string,
  borderColor?: string,
  iconColor?: string,
  iconSize?: number,
  fontColor?: string,
  fontSize?: number,
  fontFamily?: string,
  placeholder?: string,
  backgroundColor?: string,
  disabled?: boolean,
  onClearPress?: () => void,
  onTimeSelected: (time: string) => void,
  valueText?: string,
};

const TimePickerComponent = ({
  title,
  valueText = '00:00',
  rippleColor,
  borderColor = '#0000009A',
  iconColor = '#000000',
  iconSize = 24,
  fontColor = '#000000',
  fontSize = RFValue(11.5),
  fontFamily = Fonts.FordAntennaWGLRegular,
  placeholder = '',
  backgroundColor = '#fff',
  disabled = false,
  onClearPress,
  onTimeSelected
}: Props) => {
  const [chosenTime, setChosenTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [initialText, setInitialText] = useState<string>(valueText); // Texto inicial

  useEffect(() => {
    setInitialText(valueText)
  }, [valueText])

  const onChange = (event: any, selectedTime: any) => {
    if (selectedTime !== undefined) {
      setShowPicker(false);
      if (selectedTime) {
        setChosenTime(selectedTime);
        const hora = selectedTime.getHours() < 10 ? '0' + selectedTime.getHours() : selectedTime.getHours()
        const minutos = selectedTime.getMinutes() < 10 ? '0' + selectedTime.getMinutes() : selectedTime.getMinutes()
        setInitialText(hora + ':' + minutos); // Actualiza el texto inicial con la hora seleccionada
        onTimeSelected(hora + ':' + minutos);
      }
    }
  };

  const showTimePicker = () => {
    setShowPicker(true);
  };

  return (
    <TouchableRipple
      borderless
      rippleColor={rippleColor}
      onPress={showTimePicker}
    >
      <View style={[styles.pickerWrapper, styles.selectWrapper, { backgroundColor: backgroundColor }]}>
        <Text style={styles.buttonTextStyle}>{initialText}</Text>
        {showPicker && (
          <DateTimePicker
            locale='es-AR'
            value={chosenTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    width: '100%',
    flex: 1,
    marginRight: 12
  }, selectWrapper: {
    backgroundColor: theme.colors.transparent,
    paddingVertical: 6,
    height: 46,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: RFValue(1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  timeDisplay: {
    marginTop: 20,
  },
  buttonTextStyle: {
    color: 'black'
  }
});

export default TimePickerComponent;
