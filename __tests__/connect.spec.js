import React from 'react';
import renderer from 'react-test-renderer';
import Provider, { connect } from '../lib';

describe('Components connected to provider', () => {
  test('passes states and actions to props', () => {
    class ComponentA extends React.Component {
      render = () => (
        <div>
          <h1>my component!</h1>
        </div>
      )
    }

    const MyComponent = connect(states => ({
      user: states.user
    }))(ComponentA);

    const componentInstance = renderer.create(
      <Provider store={{ user: 'testUser' }}>
        <MyComponent myProp="yow!" />
      </Provider>
    ).root.findByType(ComponentA);

    expect(componentInstance.props).toEqual({
      user: 'testUser',
      myProp: 'yow!'
    });
  });
  test('passes actions to props and calls them with store as first parameter and calls callback with the updated state', () => {
    class ComponentA extends React.Component {
      render = () => (
        <div>
          <h1>my component!</h1>
        </div>
      )
    }

    const callback = jest.fn().mockName('store.updateStore callback');

    const MyComponent = connect(states => ({
      user: states.user,
      other: states.other
    }), {
      myAction (store, user, other) {
        store.updateStore({
          user,
          other
        }, callback);
      }
    })(ComponentA);

    const componentInstance = renderer.create(
      <Provider store={{ user: null, other: null }}>
        <MyComponent myProp="yow!" />
      </Provider>
    );

    const targetComponentInstance = componentInstance.root.findByType(ComponentA);

    expect(targetComponentInstance.props.user).toEqual(null);
    expect(targetComponentInstance.props.other).toEqual(null);
    targetComponentInstance.props.myAction('testuser', 'testother');
    expect(componentInstance.getInstance().state.user).toEqual('testuser');
    expect(componentInstance.getInstance().state.other).toEqual('testother');
    expect(targetComponentInstance.props.user).toEqual('testuser');
    expect(targetComponentInstance.props.other).toEqual('testother');
    expect(callback).toHaveBeenCalledWith({
      user: 'testuser',
      other: 'testother'
    });
  });
  test('persists state on store.updateStore using the default key', () => {
    class ComponentA extends React.Component {
      render = () => (
        <div>
          <h1>my component!</h1>
        </div>
      )
    }

    const MyComponent = connect(states => ({
      user: states.user,
      other: states.other
    }), {
      myAction (store, user, other) {
        store.updateStore({
          user,
          other
        });
      }
    })(ComponentA);

    const componentInstance = renderer.create(
      <Provider
        store={{ user: null, other: null }}
        persist={{
          storage: {
            getItem: jest.fn(() => JSON.stringify({})).mockName('storage.getItem'),
            setItem: jest.fn().mockName('storage.setItem'),
            removeItem: jest.fn().mockName('storage.removeItem')
          },
          statesToPersist (savedStates) {
            return savedStates;
          }
        }}>
        <MyComponent myProp="yow!" />
      </Provider>
    );

    const targetComponentInstance = componentInstance.root.findByType(ComponentA);

    expect(targetComponentInstance.props.user).toEqual(null);
    expect(targetComponentInstance.props.other).toEqual(null);
    targetComponentInstance.props.myAction('testuser', 'testother');
    expect(componentInstance.getInstance().state.user).toEqual('testuser');
    expect(componentInstance.getInstance().state.other).toEqual('testother');
    expect(targetComponentInstance.props.user).toEqual('testuser');
    expect(targetComponentInstance.props.other).toEqual('testother');
    expect(componentInstance.getInstance().props.persist.storage.removeItem).toHaveBeenCalledWith('react-context-api-store');
    expect(componentInstance.getInstance().props.persist.storage.setItem).toHaveBeenCalledWith('react-context-api-store', JSON.stringify({
      user: 'testuser',
      other: 'testother'
    }));
  });
  test('persists state on store.updateStore using the custom key', () => {
    class ComponentA extends React.Component {
      render = () => (
        <div>
          <h1>my component!</h1>
        </div>
      )
    }

    const MyComponent = connect(states => ({
      user: states.user,
      other: states.other
    }), {
      myAction (store, user, other) {
        store.updateStore({
          user,
          other
        });
      }
    })(ComponentA);

    const componentInstance = renderer.create(
      <Provider
        store={{ user: null, other: null }}
        persist={{
          key: 'my-custom-key',
          storage: {
            getItem: jest.fn(() => JSON.stringify({})).mockName('storage.getItem'),
            setItem: jest.fn().mockName('storage.setItem'),
            removeItem: jest.fn().mockName('storage.removeItem')
          },
          statesToPersist (savedStates) {
            return savedStates;
          }
        }}>
        <MyComponent myProp="yow!" />
      </Provider>
    );

    const targetComponentInstance = componentInstance.root.findByType(ComponentA);

    expect(targetComponentInstance.props.user).toEqual(null);
    expect(targetComponentInstance.props.other).toEqual(null);
    targetComponentInstance.props.myAction('testuser', 'testother');
    expect(componentInstance.getInstance().state.user).toEqual('testuser');
    expect(componentInstance.getInstance().state.other).toEqual('testother');
    expect(targetComponentInstance.props.user).toEqual('testuser');
    expect(targetComponentInstance.props.other).toEqual('testother');
    expect(componentInstance.getInstance().props.persist.storage.removeItem).toHaveBeenCalledWith('my-custom-key');
    expect(componentInstance.getInstance().props.persist.storage.setItem).toHaveBeenCalledWith('my-custom-key', JSON.stringify({
      user: 'testuser',
      other: 'testother'
    }));
  });
});