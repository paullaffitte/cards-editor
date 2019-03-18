import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceByName, getEffectsByIds } from '../state/selectors/deck';

class Card extends Component {

  render() {
    const effects = this.props.effects.map(({ description }) => description).filter(Boolean).join('. ') + '.';
    return (
      <div className="card">
        <h3>{this.props.name}</h3>
        <div>{effects}<br />{this.props.description}</div>
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
  background: getResourceByName(state, props.background),
  effects: getEffectsByIds(state, props.effects)
});

export default connect(mapStateToProps)(Card);
