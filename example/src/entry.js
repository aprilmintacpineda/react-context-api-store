import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
import Provider from 'react-context-api-store';

import routes from './routes';

import store from './store';

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <HashRouter>
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
        </HashRouter>
      </Provider>
    );
  }
}

render(
  <App />,
  document.querySelector('#app')
);