import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../lib';

const store = {
  todos: [
    {
      name: 'Code',
      status: 'Doing'
    }
  ]
};

test('Matches snapshot when persist prop was **NOT** provided', () => {
  expect(
    renderer
    .create(
      <Provider store={store}>
        <div>
          <h1>This is the app</h1>
        </div>
      </Provider>
    )
    .toJSON()
  ).toMatchSnapshot();
});

test('Matches snapshot when persist prop was provided', () => {
  const persist = {
    storage: window.localStorage,
    statesToPersist: storedStore => {
      return {
        todos: storedStore.todos
      };
    }
  };

  expect(
    renderer
    .create(
      <Provider store={store} persist={persist}>
        <div>
          <h1>This is the app</h1>
        </div>
      </Provider>
    )
    .toJSON()
  ).toMatchSnapshot();
});