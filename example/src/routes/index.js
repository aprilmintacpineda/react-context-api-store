import Home from './Home';
import Todos from './Todos';

export default [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/todos',
    exact: true,
    component: Todos
  }
];