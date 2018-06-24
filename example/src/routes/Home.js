import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../lib';

import { changeUsername } from '../store';

class Home extends React.Component {
  render () {
    return (
      <div>
        <h1>Your username is: {this.props.userState.username}</h1>
        <p>I am using the persist feature to persist your username but not your todos.</p>
        <input
          type="text"
          placeholder="change username..."
          onChange={e => this.props.changeUsername(e.target.value)}
        />
        {
          this.props.todos.map((todo, i) =>
            <div key={i} style={{ marginBottom: '10px' }}>
              <label>
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

Home.propTypes = {
  userState: PropTypes.object.isRequired,
  changeUsername: PropTypes.func.isRequired,
  todos: PropTypes.array.isRequired
};

export default connect(store => ({
  userState: store.userState,
  todos: store.todos
}), {
  changeUsername
})(Home);