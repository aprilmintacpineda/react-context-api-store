import React from 'react';

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

  updateState = updatedState => this.setState({
    ...this.state,
    ...updatedState
  })

  render = () => (
    <StoreContext.Provider value={{
      state: { ...this.state },
      updateState: this.updateState
    }}>
      {this.props.children}
    </StoreContext.Provider>
  )
};

export { StoreContext };
export { connect };
export default Provider;