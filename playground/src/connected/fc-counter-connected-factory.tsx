import Types from 'MyTypes';
import { connect, MapStateToPropsFactory } from 'react-redux';

import { countersActions, countersSelectors } from '../features/counters';
import { FCCounter } from '../components';

type OwnProps = {
  initialCount?: number;
};

type StateProps = {
  count: number;
};

const makeMapStateToProps: MapStateToPropsFactory<
  StateProps,
  OwnProps,
  Types.RootState
> = () => {
  let offset = 0;

  return (state, ownProps) => {
    offset = ownProps.initialCount || 0;

    return {
      count: countersSelectors.getReduxCounter(state.counters) + offset,
    };
  };
};

const dispatchProps = {
  onIncrement: countersActions.increment,
};

export const FCCounterConnectedFactory = connect(
  makeMapStateToProps,
  dispatchProps
)(FCCounter);