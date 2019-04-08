import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import Card from './Card';
import '../styles/DeckViewer.scss';

const makeSize = (width, height) => ({ width, height });
const A4 = makeSize(297, 210);

const dpiBase = 95.8; // constant when exporting with chrome (empirical constatation)

const mmToIn = mm => mm / 25.4;
const inToPx = inch => inch * dpiBase;
const mmToPx = mm => inToPx(mmToIn(mm));

class DeckViewer extends Component {

  renderCard = (card, { x, y, page }, spacing, cardSize, scale) => {
    const position = {
      x: spacing + x * cardSize.width,
      y: spacing + y * cardSize.height + page * mmToPx(A4.height)
    };

    const style = {
      position: 'absolute',
      top: `${position.y}px`,
      left: `${position.x}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    };

    return (
      <div key={ JSON.stringify(position) } className="card-container" style={ style }>
        <Card { ...card } />
      </div>
    )
  };

  renderCards = () => {
    const spacing = mmToPx(this.props.exportConfig.spacing);
    const scale = dpiBase / this.props.exportConfig.dpi;
    const cardSize = makeSize(this.props.cardSize.width * scale + spacing, this.props.cardSize.height * scale + spacing);
    const A4px = makeSize(mmToPx(A4.width), mmToPx(A4.height));

    const maxBy = {
      row: Math.floor(A4px.width / cardSize.width),
      col: Math.floor(A4px.height / cardSize.height)
    };

    const cards = [];
    const pos = { x: 0, y: 0, page: 0 };
    this.props.cards.forEach(card => {
      for (let i = 0; i < this.props.exportConfig.cardsQuantity[card.id]; i++) {
        cards.push(this.renderCard(card, pos, spacing, cardSize, scale));
        if (++pos.x >= maxBy.row) {
          pos.x = 0;
          if (++pos.y >= maxBy.col) {
            pos.y = 0;
            ++pos.page;
          }
        }
      }
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
  exportConfig: state.deck.current.exportConfig,
  cardSize: state.deck.cardSize
});

export default connect(mapStateToProps)(DeckViewer);
