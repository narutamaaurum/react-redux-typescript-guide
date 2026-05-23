import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { FCCounterConnectedBindActionCreators as ConnectedCounter } from './fc-counter-connected-bind-action-creators';

const reducer = combineReducers({
  counters: combineReducers({
    reduxCounter: (state: number = 0, action: any) => {
      switch (action.type) {
        case 'counters/INCREMENT':
          return state + 1;

        default:
          return state;
      }
    },
  }),
});

afterEach(() => {
  jest.useRealTimers();
  cleanup();
});

test('can dispatch the delayed increment thunk', async () => {
  jest.useFakeTimers();

  const label = 'Counter 1';
  renderWithRedux(<ConnectedCounter label={label} />);

  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText(RegExp(label)).textContent).toBe(label + ': 0');

  await act(async () => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByText(RegExp(label)).textContent).toBe(label + ': 1');
});

function renderWithRedux(
  jsx: JSX.Element,
  options: { initialState?: object } = {}
) {
  const store = createStore(
    reducer,
    options.initialState,
    applyMiddleware(thunk)
  );

  return render(<Provider store={store}>{jsx}</Provider>);
}