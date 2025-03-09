import { ReactElement, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  LayoutAnimation,
} from 'react-native';

import ElementTitle from '../list/ElementTitle';
import AdditionalInfoPoints from './AdditionalInfoPoints';
import { GlobalStyles } from '../../../constants/styles';
import { Icons } from '../../../models';
import IconButton from '../IconButton';

interface AdditionalInfoBoxProps {
  onPressEdit: () => void;
  title: string;
  info: { title: string; value: string };
  additionalInfo: { title: string; value: string }[];
  link?: string | undefined;
  style?: ViewStyle;
}

const AdditionalInfoBox: React.FC<AdditionalInfoBoxProps> = ({
  onPressEdit,
  additionalInfo,
  link,
  info,
  title,
  style,
}): ReactElement => {
  const [openInfoBox, setOpenInfoBox] = useState(false);

  const handleOpenInfoBox = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: 'spring', springDamping: 0.6 },
    });
    setOpenInfoBox((prevState) => !prevState);
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={handleOpenInfoBox}
        android_ripple={{ color: GlobalStyles.colors.accent200 }}
        style={({ pressed }) => [
          styles.innerContainer,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.mainInfoContainer}>
          <View style={styles.textContainer}>
            <ElementTitle style={styles.title}>{title}</ElementTitle>
            <Text style={styles.text}>
              {info.title} {info.value}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <IconButton
              icon={Icons.edit}
              color={GlobalStyles.colors.accent800}
              onPress={onPressEdit}
              style={styles.button}
            />
          </View>
        </View>
        <AdditionalInfoPoints
          additionalInfo={additionalInfo}
          openInfoBox={openInfoBox}
          link={link}
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
    marginVertical: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.accent700,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: GlobalStyles.colors.accent100,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInfoContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    width: '80%',
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    width: '20%',
  },
  pressed: {
    opacity: 0.5,
  },
  button: {
    width: 'auto',
    // marginHorizontal: 'auto',
  },
});

export default AdditionalInfoBox;
