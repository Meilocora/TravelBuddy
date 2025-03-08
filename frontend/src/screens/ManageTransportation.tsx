import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Icons,
  JourneyBottomTabsParamsList,
  MajorStageStackParamList,
  Transportation,
} from '../models';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { MajorStageContext } from '../store/majorStage-context.';
import IconButton from '../components/UI/IconButton';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown } from 'react-native-reanimated';
import TransportationForm from '../components/Transportation/TransportationForm';
import { MinorStageContext } from '../store/minorStage-context';
import { JourneyContext } from '../store/journey-context';

interface ManageTransportationProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageTransportation'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageTransportation'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  transportation?: Transportation;
  mode?: 'major' | 'minor';
}

const ManageTransportation: React.FC<ManageTransportationProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const planningNavigation =
    useNavigation<BottomTabNavigationProp<JourneyBottomTabsParamsList>>();

  const journeyCtx = useContext(JourneyContext);
  const minorStageCtx = useContext(MinorStageContext);
  const majorStageCtx = useContext(MajorStageContext);
  const { journeyId, majorStageId, minorStageId, transportationId } =
    route.params;
  let isEditing = !!transportationId;

  let selectedTransportation: Transportation | undefined;
  if (minorStageId) {
    selectedTransportation = minorStageCtx.minorStages.find(
      (minorStage) => minorStage.id === minorStageId
    )!.transportation;
  } else if (majorStageId) {
    selectedTransportation = majorStageCtx.majorStages.find(
      (majorStage) => majorStage.id === majorStageId
    )!.transportation;
  }

  const [transportationValues, setTransportationValues] = useState();

  useLayoutEffect(() => {
    planningNavigation.setOptions({
      headerTitleAlign: 'center',
      title: isEditing ? `Manage Transportation` : 'Add Transportation',
      headerLeft: ({ tintColor }) => (
        <IconButton
          color={tintColor}
          size={24}
          icon={Icons.arrowBack}
          onPress={() => {
            planningNavigation.navigate('Planning', { journeyId: journeyId! });
          }}
        />
      ),
    });
  }, [navigation]);

  // async function deleteMajorStageHandler() {
  //     try {
  //       const { error, status } = await deleteMajorStage(editedMajorStageId!);
  //       if (!error && status === 200) {
  //         majorStageCtx.deleteMajorStage(editedMajorStageId!);
  //         const popupText = `Major Stage successfully deleted!`;
  //         planningNavigation.navigate('Planning', {
  //           journeyId: journeyId,
  //           popupText: popupText,
  //         });
  //       } else {
  //         setError(error!);
  //         return;
  //       }
  //     } catch (error) {
  //       setError('Could not delete major stage!');
  //     }
  //     setIsDeleting(false);
  //     return;
  //   }

  function cancelHandler() {
    planningNavigation.navigate('Planning', { journeyId: journeyId! });
  }

  async function confirmHandler({
    status,
    error,
    transportation,
    mode,
  }: ConfirmHandlerProps) {
    if (error) {
      setError(error);
      return;
    } else if (
      (transportation && status === 200) ||
      (transportation && status === 201)
    ) {
      if (mode === 'major') {
        console.log('In here');
        await majorStageCtx.refetchMajorStages(journeyId!);
        await journeyCtx.refetchJourneys();
        const majorStageTitle = majorStageCtx.majorStages.find(
          (majorStage) => majorStage.id === majorStageId
        )!.title;

        console.log('Here');

        const popupText = `"${majorStageTitle}" successfully updated!`;
        planningNavigation.navigate('Planning', {
          journeyId: journeyId!,
          popupText: popupText,
        });

        console.log('Major stage updated');
      } else if (mode === 'minor') {
        await minorStageCtx.refetchMinorStages(majorStageId!);
        await journeyCtx.refetchJourneys();
        // const popupText = `"${majorStage.title}" successfully updated!`;
        // planningNavigation.navigate('Planning', {
        // journeyId: journeyId,
        // popupText: popupText,
        // });
      }
    }
  }

  return (
    <>
      <View style={styles.root}>
        <Animated.ScrollView entering={FadeInDown}>
          <TransportationForm
            onCancel={cancelHandler}
            onSubmit={confirmHandler}
            submitButtonLabel={isEditing ? 'Update' : 'Add'}
            defaultValues={isEditing ? selectedTransportation : undefined}
            isEditing={isEditing}
            journeyId={journeyId!}
            majorStageId={majorStageId!}
            minorStageId={minorStageId || undefined}
          />
        </Animated.ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
});

export default ManageTransportation;
