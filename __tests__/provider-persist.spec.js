import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../lib';

const store = {
  authUser: {
    user: null
  },
  todos: []
};

const persistedStates = {
  todos: [
    {
      name: 'Code',
      status: 'Doing'
    }
  ]
};

const mockedStorage = {
  getItem: () => JSON.stringify(persistedStates)
};

test('matches snapshot when persist was provided', () => {
  expect(
    renderer.create(
      <Provider
        store={store}
        persist={{
          storage: mockedStorage,
          statesToPersist: storedStore => ({
            todos: storedStore.todos
          })
        }}
      >
        <div>
          <h1>This is the app</h1>
        </div>
      </Provider>
    ).toJSON()
  ).toMatchSnapshot();
});

test('calls persist.storage.getItem when persist prop was provided', () => {
  const persist = {
    storage: {
      getItem: jest.fn()
    },
    statesToPersist: jest.fn()
  };

  expect(renderer.create(
    <Provider
      store={store}
      persist={persist}
    >
      <div>
        <h1>This is the app</h1>
      </div>
    </Provider>
  ).getInstance().props.persist.storage.getItem).toHaveBeenCalledWith('react-context-api-store');

  expect(renderer.create(
    <Provider
      store={store}
      persist={{
        ...persist,
        key: 'my-app-custom-key'
      }}
    >
      <div>
        <h1>This is the app</h1>
      </div>
    </Provider>
  ).getInstance().props.persist.storage.getItem).toHaveBeenCalledWith('my-app-custom-key');
});

test('does not call persist.statesToPersist when store.getItem returned null', () => {
  const persist = {
    storage: {
      getItem: () => null
    },
    statesToPersist: jest.fn()
  };

  expect(renderer.create(
    <Provider store={store} persist={persist}>
      <div>
        <h1>This is the app</h1>
      </div>
    </Provider>
  ).getInstance().props.persist.statesToPersist).not.toHaveBeenCalled();
});

test('calls persist.statesToPersist when persist prop was provided when store.getItem did not return null', () => {
  const persist = {
    storage: mockedStorage,
    statesToPersist: jest.fn()
  };

  expect(renderer.create(
    <Provider
      store={store}
      persist={persist}
    >
      <div>
        <h1>This is the app</h1>
      </div>
    </Provider>
  ).getInstance().props.persist.statesToPersist).toHaveBeenCalled();
});

test('sets state based on what the persist.statesToPersist returned and sets persisted to true', () => {
  const persist = {
    storage: mockedStorage,
    statesToPersist: storedStore => ({
      todos: storedStore.todos
    })
  };

  const componentInstance = renderer.create(
    <Provider
      store={store}
      persist={persist}
    >
      <div>
        <h1>This is the app</h1>
      </div>
    </Provider>
  ).getInstance();

  expect(componentInstance.state).toEqual({
    authUser: {
      user: null
    },
    ...persistedStates
  });

  expect(componentInstance.persisted).toEqual(true);
});