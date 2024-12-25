import { Costs, Transportation } from './other_models';

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
