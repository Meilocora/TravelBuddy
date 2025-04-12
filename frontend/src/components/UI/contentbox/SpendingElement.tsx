import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';

import {
  Activity,
  ButtonMode,
  ColorScheme,
  Icons,
  MajorStageStackParamList,
  MinorStage,
  Spending,
} from '../../../models';
import Button from '../Button';
import Link from '../Link';
import { useState } from 'react';
import { GlobalStyles } from '../../../constants/styles';
import IconButton from '../IconButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatAmount, generateRandomString } from '../../../utils';

interface SpendingListElementProps {
  spending: Spending;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const SpendingListElement: React.FC<SpendingListElementProps> = ({
  spending,
  handleEdit,
  handleDelete,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MajorStageStackParamList>>();
  const [isOpened, setIsOpened] = useState(false);

  const tableHeaders = ['Name', 'Category', 'Amount', 'Date'];

  // TODO: Add Actions, when user taps on the spending with big modal

  return (
    <ScrollView style={listElementStyles.container}>
      <View style={[listElementStyles.row, listElementStyles.firstRow]}>
        {tableHeaders.map((header) => (
          <View
            style={listElementStyles.rowElement}
            key={generateRandomString()}
          >
            <Text style={listElementStyles.headerText}>{header}</Text>
          </View>
        ))}
      </View>

      {/* <View style={listElementStyles.rowElement}>
                  <Text style={listElementStyles.subtitle}>Costs: </Text>
                  <Text
                    style={listElementStyles.description}
                    ellipsizeMode='tail'
                    numberOfLines={1}
                  >
                    {formatAmount(activity.costs)}
                  </Text>
                </View> */}
    </ScrollView>
  );
};

const listElementStyles = StyleSheet.create({
  container: {
    marginVertical: 5,
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  firstRow: {
    backgroundColor: GlobalStyles.colors.gray500,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rowElement: {
    flexBasis: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomWidth: 3,
    // borderBottomColor: GlobalStyles.colors.complementary200,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    // paddingHorizontal: 10,
    paddingVertical: 5,
    color: GlobalStyles.colors.gray200,
  },
});

interface SpendingElementProps {
  minorStage: MinorStage;
  handleAdd: () => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const SpendingElement: React.FC<SpendingElementProps> = ({
  minorStage,
  handleAdd,
  handleEdit,
  handleDelete,
}) => {
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      {minorStage.costs.spendings!.length === 0 ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>No spendings found</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: screenHeight / 3 }}>
          {minorStage.costs.spendings!.map((spending) => (
            <SpendingListElement
              spending={spending}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              key={generateRandomString()}
            />
          ))}
        </ScrollView>
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleAdd}
          colorScheme={ColorScheme.complementary}
          mode={ButtonMode.flat}
        >
          Add Spending
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpendingElement;
