import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getEditedCard, getCards, getResourceByName } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import List from './List';

class CardList extends Component {

  selectCard = card => this.props.dispatch(DeckActions.selectCard(card.id));

  addCard = () => this.props.dispatch(DeckActions.addCard());

  deleteCard = card => this.props.dispatch(DeckActions.deleteCard(card.id));

  cardToItem = card => ({ ...card,
    className: [
      card.id === this.props.selectedCard.id ? 'selected' : '',
      card.updated ? 'updated' : ''
    ].join(' ')
  });

  render() {
    return (
      <List
        deleteItem={this.deleteCard}
        selectItem={this.selectCard}
        addItem={this.addCard}
        items={this.props.cards.map(this.cardToItem)}
      />
    );
  }
}

const mapStateToProps = state => ({
  selectedCard: getEditedCard(state),
  cards: getCards(state).map(card => ({
    ...card,
    thumbnail: getResourceByName(state, card.thumbnail)
  })),
});

export default connect(mapStateToProps)(CardList);
