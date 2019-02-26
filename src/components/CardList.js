import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCards, getResourceByName } from '../state/selectors/deck';
import '../styles/CardList.scss';

class CardList extends Component {

  renderCardItem(card) {
    return (
      <div className="card" style={{backgroundImage: `url('${card.thumbnail}')`}}>
        <div className="background">
          <div className="information">
            <h2>{card.name}</h2>
            <span>{card.description}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="CardList">
        <h2 style={{color: 'white'}}>CardList</h2>
        {this.props.cards.map(this.renderCardItem)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cards: getCards(state).map(card => ({
    ...card,
    thumbnail: getResourceByName(state, card.thumbnail)
  })),
});

export default connect(mapStateToProps)(CardList);
