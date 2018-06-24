import React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';
import Provider, { connect } from '../lib';

test('passes states as props to connected components', () => {
  const persist = {
    storage: {
      getItem: jest.fn(),
      setItem: jest.fn()
    },
    statesToPersist: () => ({})
  };

  const store = {
    authUser: {
      user: null
    },
    todos: []
  };

  class AComponent extends React.Component {
    render = () => (
      <div>
        <h1>my component!</h1>
      </div>
    )
  }

  const MyComponent = connect(states => ({
    todos: states.todos
  }))(AComponent);

  const componentInstance = renderer.create(
    <Provider store={store} persist={persist}>
      <MyComponent />
    </Provider>
  ).root.findByType(AComponent);

  expect(componentInstance.props).toEqual({
    todos: []
  });
});

test('calls persist.storage.setItem with default key when an action was dispatched an persist prop was provided', () => {
  const persist = {
    storage: {
      getItem: jest.fn(),
      setItem: jest.fn()
    },
    statesToPersist: () => ({})
  };

  const store = {
    authUser: {
      user: null
    },
    todos: []
  };

  const newTodo = {
    name: 'test todo'
  };

  class AComponent extends React.Component {
    render = () => (
      <div>
        <h1>my component!</h1>
      </div>
    )
  }

  AComponent.propTypes = {
    addTodo: PropTypes.func.isRequired
  };

  function addTodo (store, todo) {
    store.updateStore({
      todos: [
        ...store.state.todos,
        todo
      ]
    });
  };

  const MyComponent = connect(states => ({
    todos: states.todos
  }), {
    addTodo
  })(AComponent);

  const componentInstance = renderer.create(
    <Provider store={store} persist={persist}>
      <MyComponent />
    </Provider>
  );

  const targetComponent = componentInstance.root.findByType(AComponent);

  expect(targetComponent.props.todos).toEqual([]);
  expect(targetComponent.props.addTodo).toBeInstanceOf(Function);
  targetComponent.props.addTodo(newTodo);
  expect(targetComponent.props.todos).toEqual([
    { ...newTodo }
  ]);
  expect(persist.storage.setItem).toHaveBeenCalledWith('react-context-api-store', JSON.stringify({
    authUser: {
      user: null
    },
    todos: [
      { ...newTodo }
    ]
  }));
});

test('calls persist.storage.setItem with custom key when an action was dispatched an persist prop was provided', () => {
  const persist = {
    storage: {
      getItem: jest.fn(),
      setItem: jest.fn()
    },
    statesToPersist: () => ({}),
    key: 'my-custom-key'
  };

  const store = {
    authUser: {
      user: null
    },
    todos: []
  };

  const newTodo = {
    name: 'test todo'
  };

  class AComponent extends React.Component {
    render = () => (
      <div>
        <h1>my component!</h1>
      </div>
    )
  }

  AComponent.propTypes = {
    addTodo: PropTypes.func.isRequired
  };

  function addTodo (store, todo) {
    store.updateStore({
      todos: [
        ...store.state.todos,
        todo
      ]
    });
  };

  const MyComponent = connect(states => ({
    todos: states.todos
  }), {
    addTodo
  })(AComponent);

  const componentInstance = renderer.create(
    <Provider store={store} persist={persist}>
      <MyComponent />
    </Provider>
  );

  const targetComponent = componentInstance.root.findByType(AComponent);

  expect(targetComponent.props.todos).toEqual([]);
  expect(targetComponent.props.addTodo).toBeInstanceOf(Function);
  targetComponent.props.addTodo(newTodo);
  expect(targetComponent.props.todos).toEqual([
    { ...newTodo }
  ]);
  expect(persist.storage.setItem).toHaveBeenCalledWith('my-custom-key', JSON.stringify({
    authUser: {
      user: null
    },
    todos: [
      { ...newTodo }
    ]
  }));
});

test('does not call persist.storage.setItem action was dispatched an persist prop was **NOT** provided', () => {
  const persist = {
    storage: {
      getItem: jest.fn(),
      setItem: jest.fn()
    },
    statesToPersist: () => ({})
  };

  const store = {
    authUser: {
      user: null
    },
    todos: []
  };

  const newTodo = {
    name: 'test todo'
  };

  class AComponent extends React.Component {
    render = () => (
      <div>
        <h1>my component!</h1>
      </div>
    )
  }

  AComponent.propTypes = {
    addTodo: PropTypes.func.isRequired
  };

  function addTodo (store, todo) {
    store.updateStore({
      todos: [
        ...store.state.todos,
        todo
      ]
    });
  };

  const MyComponent = connect(states => ({
    todos: states.todos
  }), {
    addTodo
  })(AComponent);

  const componentInstance = renderer.create(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );

  const targetComponent = componentInstance.root.findByType(AComponent);

  expect(targetComponent.props.todos).toEqual([]);
  expect(targetComponent.props.addTodo).toBeInstanceOf(Function);
  targetComponent.props.addTodo(newTodo);
  expect(targetComponent.props.todos).toEqual([
    { ...newTodo }
  ]);
  expect(persist.storage.setItem).not.toHaveBeenCalled();
});