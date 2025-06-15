import { SpendingCategory } from '../src/models';

interface SpendingsObject {
  amount: number;
  percentage: number;
  color: string;
}

interface ChartData {
  value: number;
  color: string;
  focused?: boolean;
}

export class SpendingsList {
  private spendings: Record<SpendingCategory, SpendingsObject>;

  constructor(colors: string[]) {
    this.spendings = {} as Record<SpendingCategory, SpendingsObject>;
    Object.values(SpendingCategory).forEach((category, idx) => {
      this.spendings[category] = {
        amount: 0,
        percentage: 0,
        color: colors[idx % colors.length],
      };
    });
  }

  addAmount(category: SpendingCategory, amount: number) {
    this.spendings[category].amount += amount;
    this.updatePercentages();
  }

  getSpendings(): SpendingsObject[] {
    return Object.values(this.spendings);
  }

  getChartData(): ChartData[] {
    return Object.values(this.spendings).map((spending) => ({
      value: spending.amount,
      color: spending.color,
      focused: spending.amount > 0, // Focus on categories with non-zero amounts
    }));
  }

  getTotalAmount(): number {
    return Object.values(this.spendings).reduce(
      (sum, obj) => sum + obj.amount,
      0
    );
  }

  private updatePercentages() {
    const total = Object.values(this.spendings).reduce(
      (sum, obj) => sum + obj.amount,
      0
    );
    Object.values(this.spendings).forEach((obj) => {
      obj.percentage = total > 0 ? (obj.amount / total) * 100 : 0;
    });
  }
}
