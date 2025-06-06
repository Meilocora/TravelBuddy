import { Costs, Transportation, Validable } from './other_models';

export interface MajorStage {
  id: number;
  title: string;
  done: boolean;
  scheduled_start_time: string;
  scheduled_end_time: string;
  additional_info: string;
  country: string;
  costs: Costs;
  transportation?: Transportation;
  minorStagesIds?: number[];
}

export interface MajorStageValues {
  title: string;
  done: boolean;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  additional_info: string | null;
  budget: number;
  spent_money: number;
  country: string;
}

export interface MajorStageFormValues {
  title: Validable<string>;
  done: Validable<boolean>;
  scheduled_start_time: Validable<string | null>;
  scheduled_end_time: Validable<string | null>;
  additional_info: Validable<string | undefined>;
  budget: Validable<number>;
  spent_money: Validable<number>;
  country: Validable<string>;
}
