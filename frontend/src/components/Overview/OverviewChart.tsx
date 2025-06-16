import { ReactElement, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { GlobalStyles } from '../../constants/styles';
import { Journey } from '../../models';
import { SpendingsList } from '../../../classes/SpendingsList';
import Legend from '../UI/chart/Legend';
import { formatAmount } from '../../utils';

interface OverviewChartProps {
  journey: Journey;
}

const OverviewChart: React.FC<OverviewChartProps> = ({
  journey,
}): ReactElement => {
  const [mode, setMode] = useState<'amount' | 'percentage'>('amount');
  // TODO: Implement Switch-Component between amounts and percentages
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
  spendingsList.fillSpendingsList(journey);
  const totalAmount = spendingsList.getTotalAmount();
  const chartData = spendingsList.getChartData(mode);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <PieChart
          data={chartData}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: GlobalStyles.colors.gray500,
                    fontWeight: 'bold',
                  }}
                  numberOfLines={1}
                >
                  {formatAmount(totalAmount)}
                </Text>
              </View>
            );
          }}
        />
      </View>
      <Legend data={chartData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 20,
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 'auto',
    backgroundColor: 'rgba(222, 226, 230, 0.5)',
    borderRadius: 20,
  },
  chart: {
    padding: 20,
    alignItems: 'center',
  },
});

export default OverviewChart;
