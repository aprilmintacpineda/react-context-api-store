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

  mapActionsToProps = (updateStore, storeState) => wantedMutators
  ? Object.keys(wantedMutators)
    .reduce((accumulatedMutators, mutator) => ({
      ...accumulatedMutators,
      [mutator]: this.dispatcher(updateStore, storeState, wantedMutators[mutator])
    }), {})
  : {}

  render = () => {
    return (
      <StoreContext.Consumer>
        { context =>
          <WrappedComponent
            {...this.mapStateToProps(context.state)}
            {...this.mapActionsToProps(context.updateStore, context.state)}
            {...this.props} />
        }
      </StoreContext.Consumer>
    );
  }
};

class Provider extends React.Component {
  constructor (props) {
    super(props);

    if (this.props.persist !== false) {
      const savedStore = this.props.persist.storage.getItem(
        this.props.persist.key || 'react-context-api-store'
      );

      this.state = {
        ...this.props.store,
        ...this.props.persist.statesToPersist(JSON.parse(savedStore) || {})
      };

      this.persist();
    } else {
      this.state = { ...this.props.store };
    }
  }

  persist = () => {
    if (this.props.persist !== false) {
      this.props.persist.storage.removeItem(this.props.persist.key || 'react-context-api-store');
      this.props.persist.storage.setItem(
        this.props.persist.key || 'react-context-api-store',
        JSON.stringify(this.state)
      );
    }
  }

  updateStore = (updatedStore, callback) => {
    this.setState({
      ...this.state,
      ...updatedStore
    }, () => {
      this.persist();
      if (callback) callback(this.state);
    });
  }

  render = () => (
    <StoreContext.Provider value={{
      state: { ...this.state },
      updateStore: (updatedStore, callback) => {
        this.updateStore(updatedStore, callback);
      }
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
      saveInitialState: PropTypes.bool,
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