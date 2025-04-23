import { ReactElement } from 'react';
import { MinorStage } from '../../models';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

interface AccommodationBoxProps {
  minorStage: MinorStage;
}

const AccommodationBox: React.FC<AccommodationBoxProps> = ({
  minorStage,
}): ReactElement => {
  // TODO: Make this separate ... header: Accommodation an then Name (Price), Link for Maps and if booked (Ionicon Bookmark?)
  // TODO: Let user open this, then fontsize of header increases and border shows up?!
  // if (minorStage.accommodation.place !== '') {
  //   elementDetailInfo.push(
  //     {
  //       title: 'Accommodation',
  //       value: minorStage.accommodation.place,
  //       link: minorStage.accommodation.link,
  //     },
  //     {
  //       title: 'Price',
  //       value: formatAmount(minorStage.accommodation.costs),
  //     },
  //     {
  //       title: 'Booked',
  //       value: minorStage.accommodation.booked ? 'Yes' : 'No',
  //     }
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Accommodation</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: GlobalStyles.colors.gray500,
  },
  titleContainer: {
    position: 'absolute',
    left: '50%',
    top: -12,
    transform: [{ translateX: -55 }],
    backgroundColor: GlobalStyles.colors.complementary100,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.colors.gray500,
  },
});

export default AccommodationBox;
