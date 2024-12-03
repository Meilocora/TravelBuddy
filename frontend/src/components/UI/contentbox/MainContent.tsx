import { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { MinorStage } from '../../../models';
import { formatAmount } from '../../../utils';
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

// TODO: Make this 100% generic
const MainContent: React.FC<MainContentProps> = ({
  minorStage,
  contentState,
}): ReactElement => {
  let contents: Content[] = [
    {
      title: 'costs',
      contents: [
        {
          subtitle: '',
          data: `${formatAmount(
            minorStage.costs.planned_costs
          )} / ${formatAmount(minorStage.costs.available_money)}`,
        },
      ],
    },
  ];

  if (minorStage.accommodation) {
    contents.push({
      title: 'accommodation',
      contents: [
        {
          subtitle: 'Location: ',
          data: `"${minorStage.accommodation.name}" in ${minorStage.accommodation.place}`,
          link: minorStage.accommodation.link,
        },
        {
          subtitle: 'Description: ',
          data: minorStage.accommodation.description,
        },
        {
          subtitle: 'Costs: ',
          data: formatAmount(minorStage.accommodation.costs),
        },
        {
          subtitle: 'Booked? ',
          data: minorStage.accommodation.booked ? 'Yes' : 'Not yet',
        },
      ],
    });
  }

  if (minorStage.placesToVisit) {
    contents.push({
      title: 'places',
      contents: minorStage.placesToVisit.map((place) => {
        return {
          subtitle: `${place.name}: `,
          data: place.description,
          link: place.link,
        };
      }),
    });
  }

  if (minorStage.activities) {
    contents.push({
      title: 'activities',
      contents: minorStage.activities
        .map((activity) => [
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
