import { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { MinorStage } from '../../../models';
import { formatAmount, formatDateTimeString } from '../../../utils';
import TextLink from '../TextLink';
import { generateRandomString } from '../../../utils/generator';

interface MainContentProps {
  minorStage: MinorStage;
  contentState: { activeHeader: string };
}

interface Content {
  title: string;
  contents: {
    subtitle: string;
    data: string;
    link?: string;
  }[];
}

const MainContent: React.FC<MainContentProps> = ({
  minorStage,
  contentState,
}): ReactElement => {
  let contents: Content[] = [];

  if (minorStage.transportation) {
    contents.push({
      title: 'transport',
      contents: [
        {
          subtitle: 'Departure: ',
          data: `"${formatDateTimeString(
            minorStage.transportation.start_time
          )}" at ${minorStage.transportation.place_of_departure}`,
          link: minorStage.accommodation.link,
        },
        {
          subtitle: 'Arrival: ',
          data: `"${formatDateTimeString(
            minorStage.transportation.arrival_time
          )}" at ${minorStage.transportation.place_of_arrival}`,
        },
        {
          subtitle: 'Details: ',
          data: `${minorStage.transportation.type} (${formatAmount(
            minorStage.transportation.transportation_costs
          )})`,
        },
      ],
    });
  } else {
    contents.push({
      title: 'transport',
      contents: [
        {
          subtitle: 'No transport planned yet.',
          data: '',
        },
      ],
    });
  }

  if (minorStage.placesToVisit && minorStage.placesToVisit!.length > 0) {
    contents.push({
      title: 'places',
      contents: minorStage.placesToVisit!.map((place) => {
        return {
          subtitle: `${place.name}: `,
          data: place.description,
          link: place.link,
        };
      }),
    });
  } else {
    contents.push({
      title: 'places',
      contents: [
        {
          subtitle: 'No places planned yet.',
          data: '',
        },
      ],
    });
  }

  if (minorStage.activities && minorStage.activities!.length > 0) {
    contents.push({
      title: 'activities',
      contents: minorStage
        .activities!.map((activity) => [
          {
            subtitle: `${activity.name}: `,
            data: activity.description,
            link: activity.link,
          },
          {
            subtitle: 'Place: ',
            data: activity.place,
          },
          {
            subtitle: 'Booked? ',
            data: activity.booked ? 'Yes' : 'Not yet',
          },
          {
            subtitle: 'Costs: ',
            data: formatAmount(activity.costs),
          },
        ])
        .flat(),
    });
  } else {
    contents.push({
      title: 'activities',
      contents: [
        {
          subtitle: 'No activities planned yet.',
          data: '',
        },
      ],
    });
  }

  if (minorStage.costs.spendings && minorStage.costs.spendings!.length > 0) {
    contents.push({
      title: 'spendings',
      contents: minorStage.costs.spendings!.map((spending) => {
        return {
          subtitle: `${spending.name}: `,
          data: formatAmount(spending.amount),
        };
      }),
    });
  } else {
    contents.push({
      title: 'spendings',
      contents: [
        {
          subtitle: 'No spendings found.',
          data: '',
        },
      ],
    });
  }

  const displayedContent = contents.find(
    (content) => content.title === contentState.activeHeader
  );

  return (
    <View style={styles.container}>
      {displayedContent?.contents.map((content, index) => {
        return (
          <View style={styles.detailContainer} key={generateRandomString()}>
            <Text style={styles.subtitle}>
              {content.link ? (
                <TextLink link={content.link}>{content.subtitle}</TextLink>
              ) : (
                content.subtitle
              )}
            </Text>
            <View style={styles.innerDetailContainer}>
              <Text>{content.data}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
  },
  detailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  innerDetailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontWeight: 'bold',
  },
  mainLink: {
    marginHorizontal: 'auto',
  },
});

export default MainContent;
