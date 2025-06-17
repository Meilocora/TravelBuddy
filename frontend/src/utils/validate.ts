import { Journey } from '../models';
import { parseDate, parseDateAndTime } from './formatting';

export function validateIsOver(date: string): boolean {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  return parseDate(date) < tomorrow;
}

export function validateIsOverDateTime(
  comparisonDate: string,
  comparisonDateOffset: string,
  userOffset: number
): boolean {
  const comparisonDateObject = parseDateAndTime(comparisonDate);
  comparisonDateObject.setHours(
    comparisonDateObject.getHours() + Number(comparisonDateOffset)
  );

  const currentDateObject = new Date();
  currentDateObject.setHours(currentDateObject.getHours() + userOffset);

  const timeDifference =
    comparisonDateObject.getTime() - currentDateObject.getTime();
  if (timeDifference > 0) {
    return false;
  } else {
    return true;
  }
}

export interface CheckLog {
  subtitle: string;
  description: string;
}

export function validateJourney(journey: Journey) {
  let checks: CheckLog[] = [];

  // TODO: Check if there are any gaps in the Planning

  // Check if all countries in the journey are represented in major stages
  const journeyCountries = journey.countries.map((country) => country.name);
  const majorStagesCountries = new Set(
    journey.majorStages?.map((majorStage) => majorStage.country.name) || []
  );
  const missingCountries = journeyCountries.filter(
    (country) => !majorStagesCountries.has(country)
  );

  if (missingCountries.length > 0) {
    checks.push({
      subtitle: 'Missing countries in major stages',
      description: `The following countries are not represented in any major stage: ${missingCountries.join(
        ', '
      )}.`,
    });
  }

  // Check if budget of journey is exceeded
  if (journey.costs.budget <= journey.costs.spent_money) {
    checks.push({
      subtitle: 'Journey Budget exceeded',
      description: `Your budget of ${
        journey.costs.budget
      } has been exceeded by ${
        journey.costs.spent_money - journey.costs.budget
      }.`,
    });
  }

  // Check if journey even has majorStages
  if (!journey.majorStages || journey.majorStages.length === 0) {
    checks.push({
      subtitle: 'No major stages',
      description: 'You have not added any major stages to your journey.',
    });
  } else {
    for (const majorStage of journey.majorStages) {
      // Check if the budget of the majorStage is exceeded
      if (majorStage.costs.budget <= majorStage.costs.spent_money) {
        checks.push({
          subtitle: 'Major stage budget exceeded',
          description: `Major stage "${
            majorStage.title
          }" has exceeded its budget of ${majorStage.costs.budget} by ${
            majorStage.costs.spent_money - majorStage.costs.budget
          }.`,
        });
      }
      // Check if the majorStage has a transportation
      if (!majorStage.transportation) {
        checks.push({
          subtitle: 'Missing transportation',
          description: `Major stage "${majorStage.title}" has no transportation.`,
        });
      }
      // Check if the majorStage has minorStages
      if (!majorStage.minorStages || majorStage.minorStages.length === 0) {
        checks.push({
          subtitle: 'No minor stages',
          description: `Major stage "${majorStage.title}" has no minor stages.`,
        });
      } else {
        for (const minorStage of majorStage.minorStages) {
          // Check if the budget of the minorStage is exceeded
          if (minorStage.costs.budget <= minorStage.costs.spent_money) {
            checks.push({
              subtitle: 'Minor stage budget exceeded',
              description: `Minor stage "${
                minorStage.title
              }" has exceeded its budget of ${minorStage.costs.budget} by ${
                minorStage.costs.spent_money - minorStage.costs.budget
              }.`,
            });
          }
          // Check if the minorStage has a transportation
          if (!minorStage.transportation) {
            checks.push({
              subtitle: 'Missing transportation',
              description: `Minor stage "${minorStage.title}" has no transportation.`,
            });
          }
          // Check if the minorStage has an accommodation
          if (
            !minorStage.accommodation.place &&
            !minorStage.accommodation.link &&
            !minorStage.accommodation.costs
          ) {
            checks.push({
              subtitle: 'Missing accommodation',
              description: `Minor stage "${minorStage.title}" has no accommodation.`,
            });
          }
        }
      }
    }
  }
}
