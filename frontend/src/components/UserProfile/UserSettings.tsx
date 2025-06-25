import { ReactElement, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import IconButton from '../UI/IconButton';
import { Icons } from '../../models';
import { UserContext } from '../../store/user-context';

interface UserSettingsProps {}

const UserSettings: React.FC<UserSettingsProps> = ({}): ReactElement => {
  const userCtx = useContext(UserContext);
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.innerContainer}>
          <View style={styles.element}>
            <IconButton
              icon={Icons.location}
              onPress={() => {}}
              color={GlobalStyles.colors.gray100}
              containerStyle={styles.icon}
            />
            <Text style={styles.text}>
              Latitude: {userCtx.currentLocation?.latitude}
            </Text>
            <Text style={styles.text}>
              Longitude: {userCtx.currentLocation?.longitude}
            </Text>
          </View>
          <View style={styles.element}>
            <Text style={styles.subtitle}>UTC Offset</Text>
            <Text style={styles.text}>{userCtx.timezoneoffset} h</Text>
          </View>
          <View style={styles.element}>
            <Text style={styles.subtitle}>Local Currency</Text>
            <Text style={styles.text}>
              {userCtx.localCurrency.currency}{' '}
              {userCtx.localCurrency.currency !== 'EUR' &&
                `~ ${(1 / userCtx.localCurrency.conversionRate).toFixed(2)}€`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 'auto',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginHorizontal: 'auto',
  },
  element: {
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    // width: '40%',
    borderColor: GlobalStyles.colors.gray100,
    borderWidth: 0.75,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GlobalStyles.colors.gray100,
  },
  text: {
    color: GlobalStyles.colors.gray50,
  },
  icon: {
    marginVertical: 0,
    paddingVertical: 0,
  },
});

export default UserSettings;
