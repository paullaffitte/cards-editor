import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResources, getCurrentDeck } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';

class ResourceLoader extends Component {

  onLoad = (image, resource) => {
    this.props.dispatch(DeckActions.setResourceMeta({
      ...resource,
      width: image.naturalWidth,
      height: image.naturalHeight
    }));
    this.props.dispatch(DeckActions.updateCardSize());
  }

  render() {
    return (
      <div style={{ display: 'none' }} >
      { Object.values(this.props.resources).map(resource => resource.id ? (
        <img ref={ resource.id } key={ `${resource.id}-${this.props.openAt}` }
          src={ resource.src }
          onLoad={ () => this.onLoad(this.refs[resource.id], resource) }
          alt="loader" />
      ) : null ) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: getResources(state),
  openAt: getCurrentDeck(state).openAt
});

export default connect(mapStateToProps)(ResourceLoader);
