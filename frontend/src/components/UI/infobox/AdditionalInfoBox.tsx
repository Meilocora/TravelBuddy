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
import Button from '../Button';
import { ButtonMode, ColorScheme, Icons } from '../../../models';
import IconButton from '../IconButton';

interface AdditionalInfoBoxProps {
  title: string;
  info: { title: string; value: string };
  additionalInfo: { title: string; value: string }[];
  link?: string | undefined;
  style?: ViewStyle;
}

const AdditionalInfoBox: React.FC<AdditionalInfoBoxProps> = ({
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
        <ElementTitle style={styles.title}>{title}</ElementTitle>
        <Text>
          {info.title} {info.value}
        </Text>
        <AdditionalInfoPoints
          additionalInfo={additionalInfo}
          openInfoBox={openInfoBox}
          link={link}
        />
      </Pressable>
      {openInfoBox && (
        // <Button
        //   onPress={() => {}}
        //   mode={ButtonMode.flat}
        //   colorScheme={ColorScheme.accent}
        //   style={styles.button}
        // >
        //   Edit
        // </Button>
        <IconButton
          icon={Icons.edit}
          color={GlobalStyles.colors.accent800}
          onPress={() => {}}
          style={styles.button}
        />
      )}
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
  pressed: {
    opacity: 0.5,
  },
  button: {
    // maxWidth: '20%',
    width: 'auto',
    marginHorizontal: 'auto',
  },
});

export default AdditionalInfoBox;
