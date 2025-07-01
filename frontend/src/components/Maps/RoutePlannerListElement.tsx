import { ReactElement } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

interface RoutePlannerListElementProps {
  name: string;
  onPress: () => void;
  subtitle?: string;
}

const RoutePlannerListElement: React.FC<RoutePlannerListElementProps> = ({
  name,
  onPress,
  subtitle,
}): ReactElement => {
  return (
    <Pressable style={styles.container} onPress={() => onPress()}>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 2,
  },
  subtitle: {
    marginLeft: 10,
    fontSize: 10,
    fontStyle: 'italic',
  },
  name: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    // minWidth: 150,
    // maxWidth: 200,
    width: 200,
  },
});

export default RoutePlannerListElement;
