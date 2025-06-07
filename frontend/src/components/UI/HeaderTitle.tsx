import { ReactElement } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';

interface InfoTextProps {
  title: string;
}

const HeaderTitle: React.FC<InfoTextProps> = ({ title }): ReactElement => {
  return (
    <Text
      numberOfLines={1}
      ellipsizeMode='tail'
      style={[
        styles.title,
        {
          maxWidth: Dimensions.get('window').width * 0.75,
        },
      ]}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default HeaderTitle;
