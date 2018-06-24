import React from 'react';
import PropTypes from 'prop-types';

const StoreContext = React.createContext();

const connect = (wantedState, wantedMutators) => WrappedComponent => class Connect extends React.Component {
  dispatcher = (updateStore, storeState, action) => (...payload) => action(
    {
      state: { ...storeState },
      updateStore
    },
    ...payload
  )

  mapStateToProps = storeState => wantedState
  ? wantedState({ ...storeState })
  : {}

  mapActionsToProps = (updateState, storeState) => wantedMutators
  ? Object.keys(wantedMutators)
    .reduce((accumulatedMutators, mutator) => ({
      ...accumulatedMutators,
      [mutator]: this.dispatcher(updateState, storeState, wantedMutators[mutator])
    }), {})
  : {}

  render = () => (
    <StoreContext.Consumer>
      { context =>
        <WrappedComponent
          {...this.mapStateToProps(context.state)}
          {...this.mapActionsToProps(context.updateState, context.state)}
        />
      }
    </StoreContext.Consumer>
  )
};

class Provider extends React.Component {
  state = { ...this.props.store };
  persisted = false

  updateState = updatedState => {
    const newState = {
      ...this.state,
      ...updatedState
    };

    this.setState(newState);

    if (this.props.persist !== false) {
      this.props.persist.storage.setItem(
        this.props.persist.key || 'react-context-api-store',
        JSON.stringify(newState)
      );
    }
  }

  componentDidMount () {
    if (this.props.persist !== false && !this.persisted) {
      this.persisted = true;
      const storedStore = this.props.persist.storage.getItem(
        this.props.persist.key || 'react-context-api-store'
      );

      if (storedStore) {
        this.setState({
          ...this.state,
          ...this.props.persist.statesToPersist(JSON.parse(storedStore))
        });
      }
    }
  }

  render = () => (
    <StoreContext.Provider value={{
      state: { ...this.state },
      updateState: this.updateState
    }}>
      {this.props.children}
    </StoreContext.Provider>
  )
};

Provider.propTypes = {
  children: PropTypes.element.isRequired,
  store: PropTypes.object.isRequired,
  persist: PropTypes.oneOfType([
    PropTypes.shape({
      storage: PropTypes.object.isRequired,
      statesToPersist: PropTypes.func.isRequired,
      key: PropTypes.string
    }),
    PropTypes.oneOf([false])
  ])
};

Provider.defaultProps = {
  persist: false
};

export { connect };
export default Provider;