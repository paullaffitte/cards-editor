import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import Card from './Card';
import '../styles/DeckViewer.scss';

class DeckViewer extends Component {

  renderCard = (card, key) => (
    <div key={ key } className="card-container">
      <Card { ...card } />
    </div>
  );

  renderCards = () => {
    const cards = [];

    this.props.cards.forEach(card => {
      for (let i = 0; i < this.props.exportConfig.cardsQuantity[card.id]; i++)
        cards.push(this.renderCard(card, cards.length));
    });

    return cards;
  };

  render() {
    return (
      <div className="DeckViewer">
        { this.renderCards() }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cards: state.deck.current.cards,
  exportConfig: state.deck.current.exportConfig
});

export default connect(mapStateToProps)(DeckViewer);
