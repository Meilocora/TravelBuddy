import { Journey } from '../models';

export const JOURNEYS: Journey[] = [
  {
    name: 'Journey 1',
    id: 1,
    costs: {
      available_money: 20000,
      planned_costs: 10000,
      money_exceeded: false,
    },
    scheduled_start_time: new Date('2024-10-09'),
    scheduled_end_time: new Date('2024-11-30'),
    countries: ['Germany', 'France', 'Spain'],
    done: false,
    majorStagesIds: [1, 2, 3],
  },
];
