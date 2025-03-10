import { ReactElement, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import Animated, { FadeOutUp } from 'react-native-reanimated';

interface InfoCurtainProps {
  info: string;
}

const InfoCurtain: React.FC<InfoCurtainProps> = ({ info }): ReactElement => {
  const [showInfo, setShowInfo] = useState(true);

  // TODO: Maybe use LayoutAnimation instead?
  // TODO: Make this compatible with a chosen ColorScheme (like in Button)
  return (
    <>
      {showInfo && (
        <Animated.View exiting={FadeOutUp}>
          <Pressable
            style={styles.container}
            onPress={() => setShowInfo(!showInfo)}
          >
            <Text style={styles.text}>{info}</Text>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
    backgroundColor: GlobalStyles.colors.accent100,
    borderRadius: 10,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    margin: 10,
  },
  text: {
    color: GlobalStyles.colors.accent800,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default InfoCurtain;
