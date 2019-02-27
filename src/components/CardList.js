import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getEditedCard, getCards, getResourceByName } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import '../styles/CardList.scss';

class CardList extends Component {

  selectCard = card => this.props.dispatch(DeckActions.selectCard(card.id));

  renderCardItem = (card) => {
    const className       = 'card ' + (card.id == this.props.selectedCard.id ? 'selected' : '');
    const backgroundImage = {backgroundImage: `url('${card.thumbnail}')`};

    return (
      <div key={card.id} className={className} style={backgroundImage} onClick={() => this.selectCard(card)}>
        <div className="shadow">
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
  selectedCard: getEditedCard(state),
  cards: getCards(state).map(card => ({
    ...card,
    thumbnail: getResourceByName(state, card.thumbnail)
  })),
});

export default connect(mapStateToProps)(CardList);
