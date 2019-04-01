import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import Card from './Card';
import '../styles/DeckViewer.scss';
import { getResourceByName } from '../state/selectors/deck';

const makeSize = (width, height) => ({ width, height });
const A4 = makeSize(297, 210);

const mmToIn = mm => mm / 25.4;
const inToPx = inch => inch * 95.8; // constant when exporting with chrome (empirical constatation)
const mmToPx = (mm, dpi) => inToPx(mmToIn(mm));

class DeckViewer extends Component {

  state = {
    cardSize: makeSize(100, 100)
  }

  positionToCss = (position) => ({
    position: 'absolute',
    top: `${position.y}px`,
    left: `${position.x}px`
  })

  async componentDidMount() {
    if (!this.props.cards.length)
      return;

    const onLoad = () => {
      this.setState({ cardSize: makeSize(this.background.naturalWidth, this.background.naturalHeight) });
    };

    console.log(this.props.background);
    this.background = new Image();
    this.background.onload = onLoad;
    this.background.src = this.props.background;
  }

  renderCard = (card, { x, y, page }, spacing, cardSize) => {
    const position = {
      x: spacing + x * cardSize.width,
      y: spacing + y * cardSize.height + page * mmToPx(A4.height)
    };

    return (
      <div key={ JSON.stringify(position) } className="card-container" style={this.positionToCss(position)}>
        <Card { ...card } />
      </div>
    )
  };

  renderCards = () => {
    const pageSize = makeSize(mmToPx(A4.width, this), mmToPx(A4.height));
    const spacing = 10;
    const cardSize = makeSize(this.state.cardSize.width + spacing, this.state.cardSize.height + spacing);
    const A4px = makeSize(mmToPx(A4.width), mmToPx(A4.height));

    const maxBy = {
      row: Math.floor(A4px.width / cardSize.width),
      col: Math.floor(A4px.height / cardSize.height)
    };

    const cards = [];
    const pos = { x: 0, y: 0, page: 0 };
    this.props.cards.forEach(card => {
      for (let i = 0; i < this.props.exportConfig.cardsQuantity[card.id]; i++) {
        cards.push(this.renderCard(card, pos, spacing, cardSize));
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
  background: state.deck.current.cards.length
    ? getResourceByName(state, state.deck.current.cards[0].background)
    : null,
});

export default connect(mapStateToProps)(DeckViewer);
