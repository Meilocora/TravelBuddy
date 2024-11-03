import { ReactElement, useState } from 'react';
import { Pressable, StyleSheet, View, Text, ViewStyle } from 'react-native';

import ElementTitle from '../list/ElementTitle';
import AdditionalInfoPoints from './AdditionalInfoPoints';
import { GlobalStyles } from '../../../constants/styles';

interface AdditionalInfoBoxProps {
  title: string;
  info: { title: string; value: string };
  additionalInfo: { title: string; value: string }[];
  style?: ViewStyle;
}

const AdditionalInfoBox: React.FC<AdditionalInfoBoxProps> = ({
  additionalInfo,
  info,
  title,
  style,
}): ReactElement => {
  const [openInfoBox, setOpenInfoBox] = useState(false);

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={() => setOpenInfoBox((prevState) => !prevState)}
        android_ripple={{ color: 'grey' }}
        style={({ pressed }) => [
          styles.innerContainer,
          pressed && styles.pressed,
        ]}
      >
        <ElementTitle style={styles.title}>{title}</ElementTitle>
        <Text>
          {info.title} {info.value}
        </Text>
        <AdditionalInfoPoints
          additionalInfo={additionalInfo}
          openInfoBox={openInfoBox}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outerContainer: {
    width: '90%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});

export default AdditionalInfoBox;
