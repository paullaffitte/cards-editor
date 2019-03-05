import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceByName } from '../state/selectors/deck';

class Card extends Component {

  render() {
    return (
      <div className="card">
        <h3>{this.props.name}</h3>
        <div>{this.props.description}</div>
        <div>HP: {this.props.hp}</div>
        <div>Attack: {this.props.attack}</div>

        <img ref="thumbnail" src={this.props.thumbnail} width={200} />
        <img ref="background" src={this.props.background} width={200} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  thumbnail: getResourceByName(state, props.thumbnail),
  background: getResourceByName(state, props.background)
});

export default connect(mapStateToProps)(Card);
