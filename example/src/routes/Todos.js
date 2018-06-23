import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-context-api-store';

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

Todos.propTypes = {
  userState: PropTypes.object.isRequired,
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateTodoDone: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  addTodo: PropTypes.func.isRequired
};

export default connect(store => ({
  userState: store.userState,
  todos: store.todos
}), {
  updateTodoDone,
  deleteTodo,
  addTodo
})(Todos);