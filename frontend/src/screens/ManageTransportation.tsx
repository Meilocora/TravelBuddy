import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactElement, useContext, useLayoutEffect, useState } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
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
}

const ManageTransportation: React.FC<ManageTransportationProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const planningNavigation =
    useNavigation<BottomTabNavigationProp<JourneyBottomTabsParamsList>>();

  // TODO: Maybe better refetch MajorStage, when change is made here?
  const majorStageCtx = useContext(MajorStageContext);
  const { journeyId, majorStageId, minorStageId, transportationId } =
    route.params;
  let isEditing = !!transportationId;

  const selectedTransportation = majorStageCtx.majorStages.find(
    (majorStage) => majorStage.id === majorStageId
  )!.transportation;

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

  // function confirmHandler({ status, error, majorStage }: ConfirmHandlerProps) {
  //   if (isEditing) {
  //     if (error) {
  //       setError(error);
  //       return;
  //     } else if (majorStage && status === 200) {
  //       majorStageCtx.updateMajorStage(majorStage);
  //       const popupText = `Major Stage "${majorStage.title}" successfully updated!`;
  //       planningNavigation.navigate('Planning', {
  //         journeyId: journeyId,
  //         popupText: popupText,
  //       });
  //     }
  //   } else {
  //     if (error) {
  //       setError(error);
  //       return;
  //     } else if (majorStage && status === 201) {
  //       majorStageCtx.addMajorStage(majorStage);
  //       const popupText = `Major Stage "${majorStage.title}" successfully created!`;
  //       planningNavigation.navigate('Planning', {
  //         journeyId: journeyId,
  //         popupText: popupText,
  //       });
  //     }
  //   }
  // }

  function tapHandler() {
    console.log('Tapped');
  }

  return (
    // <Pressable onPress={tapHandler}>
    <View style={styles.root}>
      <Animated.ScrollView entering={FadeInDown}>
        <TransportationForm
          onCancel={cancelHandler}
          onSubmit={() => {}}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          defaultValues={isEditing ? selectedTransportation : undefined}
          isEditing={isEditing}
          journeyId={journeyId!}
          majorStageId={majorStageId!}
          minorStageId={minorStageId || undefined}
        />
      </Animated.ScrollView>
    </View>
    // </Pressable>
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
