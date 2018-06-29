/**
 * I put all the states and action handlers in one file.
 * It does not really matter where you put them though.
 */

const defaultUsername = 'April';
const defaultTodos = [
  {
    value: 'Become a developer.',
    isDone: true
  },
  {
    value: 'Become an open-source contributor.',
    isDone: true
  },
  {
    value: 'Become a scientist.',
    isDone: false
  }
];

export default {
  userState: {
    username: defaultUsername
  },
  todos: [...defaultTodos]
};

export function changeUsername (store, updatedUsername) {
  // you can do api calls in here
  // and you can use the built in fetch api

  if (!updatedUsername) {
    return store.updateStore({
      userState: {
        username: defaultUsername
      }
    });
  }

  return store.updateStore({
    userState: {
      username: updatedUsername
    }
  });
}

export function updateTodoDone (store, isDone, targetValue, targetIndex) {
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

export function deleteTodo (store, targetValue, targetIndex) {
  store.updateStore({
    todos: store.state.todos.filter((todo, todoIndex) => todo.value != targetValue || todoIndex != targetIndex)
  });
}

export function addTodo (store, value, callback) {
  store.updateStore({
    todos: [
      ...store.state.todos,
      {
        value,
        isDone: false
      }
    ]
  }, callback);
}