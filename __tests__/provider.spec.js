import React from 'react';
import renderer from 'react-test-renderer';
import Provider from '../lib';

describe('Provider setup / initialization', () => {
  test('should persists states with custom key', () => {
    const myComponent = renderer.create(
      <Provider
        store={{
          user: null,
          other: null
        }}
        persist={{
          key: 'my-custom-key',
          storage: {
            getItem: jest.fn(() => JSON.stringify({
              user: 'testValue'
            })).mockName('storage.getItem'),
            setItem: jest.fn().mockName('storage.setItem'),
            removeItem: jest.fn().mockName('storage.removeItem')
          },
          statesToPersist (savedStates) {
            return {
              user: savedStates.user
            };
          }
        }}>
        <div>
          <p>Yow~</p>
        </div>
      </Provider>
    ).getInstance();

    expect(myComponent.props.persist.storage.getItem)
    .toBeCalledWith('my-custom-key');

    expect(myComponent.props.persist.storage.removeItem)
    .toBeCalledWith('my-custom-key');

    expect(myComponent.props.persist.storage.setItem)
    .toBeCalledWith('my-custom-key', JSON.stringify({
      user: 'testValue',
      other: null
    }));;

    expect(myComponent.state).toEqual({
      user: 'testValue',
      other: null
    });
  });
  test('should persists states with default key', () => {
    const myComponent = renderer.create(
      <Provider
        store={{
          user: null,
          other: null
        }}
        persist={{
          storage: {
            getItem: jest.fn(() => JSON.stringify({
              user: 'testValue'
            })).mockName('storage.getItem'),
            setItem: jest.fn().mockName('storage.setItem'),
            removeItem: jest.fn().mockName('storage.removeItem')
          },
          statesToPersist (savedStates) {
            return {
              user: savedStates.user
            };
          }
        }}>
        <div>
          <p>Yow~</p>
        </div>
      </Provider>
    ).getInstance();

    expect(myComponent.props.persist.storage.getItem)
    .toBeCalledWith('react-context-api-store');

    expect(myComponent.props.persist.storage.removeItem)
    .toBeCalledWith('react-context-api-store');

    expect(myComponent.props.persist.storage.setItem)
    .toBeCalledWith('react-context-api-store', JSON.stringify({
      user: 'testValue',
      other: null
    }));

    expect(myComponent.state).toEqual({
      user: 'testValue',
      other: null
    });
  });
  test('should set state to the store', () => {
    const myComponent = renderer.create(
      <Provider
        store={{
          user: null,
          other: null
        }}>
        <div>
          <p>Yow~</p>
        </div>
      </Provider>
    ).getInstance();

    expect(myComponent.state).toEqual({
      user: null,
      other: null
    });
  });
});