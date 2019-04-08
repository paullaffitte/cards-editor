import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResources } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';

class ResourceLoader extends Component {

  onLoad = (image, resource) => {
    this.props.dispatch(DeckActions.setResource({
      ...resource,
      src: image.src,
      width: image.naturalWidth,
      height: image.naturalHeight
    }));
  }

  render() {
    return (
      <div>
      { Object.values(this.props.resources).map(resource => (
        <img ref={ resource.id } key={ resource.id }
          src={ 'file://' + resource.path }
          onLoad={ () => this.onLoad(this.refs[resource.id], resource) }
          alt="loader" />
      )) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: getResources(state)
});

export default connect(mapStateToProps)(ResourceLoader);
