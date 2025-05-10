import { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface FilterSettingsProps {}

const FilterSettings: React.FC<FilterSettingsProps> = (): ReactElement => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text>Current Stages</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>All Stages</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default FilterSettings;
