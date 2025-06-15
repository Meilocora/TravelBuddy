import { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { GlobalStyles } from '../../constants/styles';
import { Journey, SpendingCategory } from '../../models';
import { SpendingsList } from '../../../classes/SpendingsList';

interface OverviewChartProps {
  journey: Journey;
}

const OverviewChart: React.FC<OverviewChartProps> = ({
  journey,
}): ReactElement => {
  // TODO: Switch between amounts and percentages
  const brightColors = [
    '#FF6F61',
    '#FFD700',
    '#40E0D0',
    '#FF69B4',
    '#7CFC00',
    '#00BFFF',
    '#FFA500',
  ];

  const spendingsList = new SpendingsList(brightColors);

  if (journey.majorStages) {
    for (const majorStage of journey.majorStages) {
      majorStage.transportation &&
        spendingsList.addAmount(
          SpendingCategory.transportation,
          majorStage.transportation.transportation_costs
        );
      if (majorStage.minorStages) {
        for (const minorStage of majorStage.minorStages) {
          minorStage.transportation &&
            spendingsList.addAmount(
              SpendingCategory.transportation,
              minorStage.transportation.transportation_costs
            );
          spendingsList.addAmount(
            SpendingCategory.acommodation,
            minorStage.accommodation.costs
          );
          if (minorStage.costs.spendings) {
            for (const spending of minorStage.costs.spendings) {
              spendingsList.addAmount(
                spending.category as SpendingCategory,
                spending.amount
              );
            }
          }
        }
      }
    }
  }

  const totalAmount = spendingsList.getTotalAmount();
  console.log(totalAmount);

  const pieData = [
    {
      value: 47,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
      focused: true,
    },
    { value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
    { value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3' },
    { value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97' },
  ];

  return (
    <View style={styles.container}>
      <PieChart data={pieData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginHorizontal: 'auto',
  },
  text: {
    color: GlobalStyles.colors.gray100,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default OverviewChart;
