# THIS PROJECT HAS BEEN ARCHIVED

Archived in favor of [react-fluxible](https://www.npmjs.com/package/react-fluxible). Please migrate.

# react-context-api-store
Seemless, lightweight, state management library that supports async actions and persistent states out of the box. Inspired by Redux and Vuex. Built on top of [React's context api](https://reactjs.org/docs/context.html).

# File size?
6.0kb transpiled. Not minified. Not compressed. Not uglified.

# Example
https://aprilmintacpineda.github.io/react-context-api-store/#/

# Guide

## Install

```
npm install react-context-api-store
yarn add react-context-api-store
```

## Usage

Usage is the same as with redux. Except I used React's new Context API in version 16.3.0. I also simplified store creation, action definition, and async action handing. If you've used Redux and Vuex in the past, everything here will be familiar to you.

###### Note

Make sure to read and understand all the notes here after as they convey a very important message.

#### The `Provider`

First, import `react-context-api-store` as `Provider`. The Provider is a component that accepts a prop called `store`. You would use this component as your top most component.

```jsx
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Provider from 'react-context-api-store';

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <ul>
              <li>
                <Link to="/todos">Todos</Link>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
            <Switch>
              {
                routes.map((route, i) => <Route key={i} {...route} />)
              }
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

render(
  <App />,
  document.querySelector('#app')
);
```

#### The `store`

The store is simply a JS object where your global states would live.

```js
{
  userState: {
    username: defaultUsername
  },
  todos: [...defaultTodos],
  anotherState: valueHere,
  oneMoreState: oneMoreValue
};
```

Then you pass this as the `store` prop to the provider.

###### Note

The provider always assume that the store is an object. No checks were added to minimize the file size. Making sure that you pass an object as the `store` is up to you.

#### Connecting a component to the store

Works the same way as with redux, with a little bit of change. You import `{ connect }` from the `react-context-api-store` package. Connect is an HOC that wraps your component with the `Provider.Consumer` and passes all the states and actions to the component as properties.

`Connect` accepts two parameters. The first parameter is a `callback function` that will receive the `store's current state`. It should return an object that maps all the states that you want the component to have.

###### Note

`connect` always assume that the first parameter is a function. No checks were added to minimize the file size.

**example code**

```js
function mapStateToProps (state => {
  console.log(state);

  return {
    // .. all the state that I want
    user: state.user,
    todos: state.todos
  }
})
```

The second parameter is an object containing all the functions that will serve as the action. This is typically what you call when the user clicks a button or a particular event occured. The action will receive the original parameters given to it, except it will receive an object as the first parameter, this object is provided by the `dispatcher`. The object contains two things, **(1)** the store's state and **(2)** a function called `updateStore`. The `updateStore` function is what you call when you want to update the state, you need to give it an object of the states that you want to update, the rest that you did not touch will remain unchanged and intact.

###### Note

- `connect` always assume that the second parameter is an object. No checks were added to minimize the file size.
- `dispatcher` always assume that all actions are functions. No checks were added to minimize the file size.
- `store.updateStore` always assume that you'll give it an object as the first parameter. No checks were added to minimize the file size.

**example code**

```jsx
// somewhere in your component
<input
  type="checkbox"
  checked={todo.isDone}
  onChange={e => this.props.updateTodoDone(e.target.checked, todo.value, i)}
/>

// the second parameter
const actions = {
  updateTodoDone (store, isDone, targetValue, targetIndex) {
    store.updateStore({
      todos: store.state.todos.map((todo, todoIndex) => {
        if (todo.value != targetValue || todoIndex != targetIndex) return todo;

        return {
          ...todo,
          isDone
        };
      })
    });
  }
}
```

Over all, you'll have something like this:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-context-api-store';

/**
 * in this example, all the action handlers are in the
 * ../store/index.js but it does matter where you store them,
 * they are just functions that when executed gains access to the
 * store.
 */
import { updateTodoDone, deleteTodo, addTodo } from '../store';

class Todos extends React.Component {
  state = {
    newTodoValue: ''
  }

  handleNewTodoSubmit = (e) => {
    e.preventDefault();

    return this.props.addTodo(this.state.newTodoValue, () => this.setState({
      newTodoValue: ''
    }));
  }

  addTodoForm = () => {
    return (
      <form onSubmit={this.handleNewTodoSubmit}>
        <input
          type="text"
          value={this.state.newTodoValue}
          onChange={e => this.setState({
            newTodoValue: e.target.value
          })}
        />
        <input type="submit" value="Add todo" />
      </form>
    );
  }

  render () {
    if (!this.props.todos.length) {
      return (
        <div>
          {this.addTodoForm()}
          <h1>Hi {this.props.userState.username}, your todo list is empty.</h1>
        </div>
      );
    }

    return (
      <div>
        {this.addTodoForm()}
        <h1>Hi {this.props.userState.username}, {'here\'s your todo list'}.</h1>
        {
          this.props.todos.map((todo, i) =>
            <div key={i} style={{ marginBottom: '10px' }}>
              <span
                style={{ cursor: 'pointer', userSelect: 'none', backgroundColor: 'red', color: 'white', marginRight: '2px', borderRadius: '2px', padding: '1px' }}
                onClick={() => this.props.deleteTodo(todo.value, i)}>x</span>
              <label style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={e => this.props.updateTodoDone(e.target.checked, todo.value, i)}
                />
                {
                  todo.isDone?
                    <span style={{ color: 'red', textDecoration: 'line-through' }}>
                      <span style={{ color: 'gray' }}>{todo.value}</span>
                    </span>
                  : <span>{todo.value}</span>
                }
              </label>
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(store => ({
  userState: store.userState,
  todos: store.todos
}), {
  updateTodoDone,
  deleteTodo,
  addTodo,
  // you could also add something else here
  anotherAction (store) {
    /**
     * if your action handler does not call store.updateState();
     * nothing will happen to the state
     */
    console.log(store);
  }
})(Todos);
```

#### Callback on `store.updateStore`

`store.updateStore` has a second optional parameter which should be a `function` that will be run as callback of `setState`. This callback will receive the store's update state as it's only parameter. Please see [react's docs](https://reactjs.org/docs/react-component.html#setstate) about `setState`.

## How to handle async actions?

The package itself does not care how you handle this, you can use `async/await` if you like or stick to the chained `.then` of promises. But don't use generator functions as the store package was not equipped with it and supporting it is not an option because it would defeat the whole purpose of this library.

**example code**

```js
function myStateHandler (store, data) {
  store.updateState({
    aState: {
      ...store.state.aState,
      loading: true
    }
  });

  fetch('/somewhere')
  .then(response => response.json())
  .then(response => {
    // do something with the response

    store.updateState({
      aState: {
        ...store.state.aState,
        loading: false,
        data: { ...response.data }
      }
    });
  });
}
```

## Persisting states

If you want to persist states, just provide a second property called `persist` which is an object that has the following shape:

```js
{
  storage: AsyncStorage, // the storage of where to save the state
  statesToPersist: savedStore => {
    // do whatever you need to do here
    // then return the states that you want to save.
    // NOTE: This is not strict, meaning, you can even
    // create a new state here and it will still be saved
    return {
      someState: { ...savedStore.someState },
      anotherState: [ ...savedStore.anotherState ],
      someValue: savedStore.someValue
    }
  }
}
```

**example snippet**

```jsx
<Provider store={store} persist={{
  storage: window.localStorage,
  statesToPersist (savedStore) {
    return { ...savedStore };
  }
}}>
```

In this case I'm passing in the `window.localStorage` as the storage but you are free to use whatever storage you need but it must have the following methods:

- `getItem` which receives the `key` as the first parameter.
- `setItem` which receives the `key` as the first parameter and `value` as the second parameter.
- `removeItem` which receives the `key` as the first parameter.

# Related

- [inferno-context-api-store](https://github.com/aprilmintacpineda/inferno-context-api-store) inferno compatible version of the same thing.