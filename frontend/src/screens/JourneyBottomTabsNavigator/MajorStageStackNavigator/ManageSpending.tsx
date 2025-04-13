import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Icons, MajorStageStackParamList, Spending } from '../../../models';
import { RouteProp } from '@react-navigation/native';
import ComplementaryGradient from '../../../components/UI/LinearGradients/ComplementaryGradient';
import { GlobalStyles } from '../../../constants/styles';
import ErrorOverlay from '../../../components/UI/ErrorOverlay';
import Animated, { FadeInDown } from 'react-native-reanimated';
import IconButton from '../../../components/UI/IconButton';
import { MinorStageContext } from '../../../store/minorStage-context';
import { MajorStageContext } from '../../../store/majorStage-context.';
import { JourneyContext } from '../../../store/journey-context';
import { deleteSpending } from '../../../utils/http/spending';
import SpendingForm from '../../../components/MinorStage/ManageSpending/SpendingForm';

interface ManageSpendingProps {
  navigation: NativeStackNavigationProp<
    MajorStageStackParamList,
    'ManageSpending'
  >;
  route: RouteProp<MajorStageStackParamList, 'ManageSpending'>;
}

interface ConfirmHandlerProps {
  error?: string;
  status: number;
  spending?: Spending;
  backendJourneyId?: number;
}

const ManageSpending: React.FC<ManageSpendingProps> = ({
  route,
  navigation,
}): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const minorStageCtx = useContext(MinorStageContext);
  const majorStageCtx = useContext(MajorStageContext);
  const journeyCtx = useContext(JourneyContext);

  const { minorStageId, spendingId, majorStageId } = route.params;
  const isEditing = !!spendingId;

  let selectedSpending: Spending | undefined;

  if (spendingId) {
    selectedSpending = minorStageCtx.minorStages
      .find((minorStage) => minorStage.id === minorStageId)!
      .costs.spendings!.find((spending) => spending.id === spendingId);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: isEditing ? 'Edit Spending' : 'Add Spending',
      headerStyle: { backgroundColor: GlobalStyles.colors.complementary700 },
    });
  }, [navigation]);

  // Empty, when no default values provided
  const [spendingValues, setSpendingValues] = useState<Spending>({
    name: selectedSpending?.name || '',
    amount: selectedSpending?.amount || 0,
    date: selectedSpending?.date || '',
    category: selectedSpending?.category || 'Other',
  });

  // Redefine spendingValues, when selectedSpending changes
  useEffect(() => {
    setSpendingValues({
      name: selectedSpending?.name || '',
      amount: selectedSpending?.amount || 0,
      date: selectedSpending?.date || '',
      category: selectedSpending?.category || 'Other',
    });
  }, [selectedSpending]);

  async function deleteHandler() {
    try {
      const { error, status, backendJourneyId } = await deleteSpending(
        spendingId!
      );
      if (!error && status === 200) {
        await minorStageCtx.refetchMinorStages(minorStageId);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(backendJourneyId!);
        await journeyCtx.refetchJourneys();
        navigation.goBack();
      } else {
        setError(error!);
        return;
      }
    } catch (error) {
      setError('Could not delete spending!');
    }
  }

  function resetValues() {
    setSpendingValues({
      name: '',
      amount: 0,
      date: '',
      category: 'Other',
    });
  }

  async function confirmHandler({
    status,
    error,
    spending,
    backendJourneyId,
  }: ConfirmHandlerProps) {
    if (isEditing) {
      if (error) {
        setError(error);
        return;
      } else if (spending && status === 200) {
        await minorStageCtx.refetchMinorStages(majorStageId);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(backendJourneyId!);
        await journeyCtx.refetchJourneys();
        navigation.goBack();
        resetValues();
      }
    } else {
      if (error) {
        setError(error);
        return;
      } else if (spending && status === 201) {
        await minorStageCtx.refetchMinorStages(majorStageId);
        // Refetch Journeys and MajorStages in case the costs have changed
        await majorStageCtx.refetchMajorStages(backendJourneyId!);
        await journeyCtx.refetchJourneys();
        navigation.goBack();
        resetValues();
      }
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  return (
    <View style={styles.root}>
      <ComplementaryGradient />
      {error && <ErrorOverlay message={error} onPress={() => setError(null)} />}
      <Animated.ScrollView entering={FadeInDown} nestedScrollEnabled={true}>
        <SpendingForm
          minorStageId={minorStageId}
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          defaultValues={isEditing ? spendingValues : undefined}
          editSpendingId={spendingId}
          isEditing={isEditing}
        />
        {isEditing && (
          <View style={styles.btnContainer}>
            <IconButton
              icon={Icons.delete}
              color={GlobalStyles.colors.error200}
              onPress={deleteHandler}
              size={46}
            />
          </View>
        )}
      </Animated.ScrollView>
    </View>
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

export default ManageSpending;
