import React, { Component } from 'react';

class Card extends Component {

  render() {
    return (
      <div className="card">
        <h3>{this.props.data.name}</h3>
        <div>{this.props.data.description}</div>
        <div>HP: {this.props.data.hp}</div>
        <div>Mana: {this.props.data.mana}</div>
      </div>
    );
  }
}

export default Card;
