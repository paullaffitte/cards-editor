import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { getEditedCard, getCards, getResourceByName } from '../state/selectors/deck';
import { Popconfirm } from 'antd';
import DeckActions from '../state/actions/deck';
import '../styles/CardList.scss';

class CardList extends Component {

  selectCard = card => this.props.dispatch(DeckActions.selectCard(card.id));

  addCard = () => this.props.dispatch(DeckActions.addCard());

  deleteCard = card => this.props.dispatch(DeckActions.deleteCard(card.id));

  renderCardItem = card => {
    const backgroundImage = {backgroundImage: `url('${card.thumbnail}')`};
    const className       =  [
      'list-item card ',
      card.id === this.props.selectedCard.id ? 'selected' : '',
      card.updated ? 'updated' : ''
    ].join(' ');

    return (
      <div key={card.id} className={className} style={backgroundImage}>
        <Popconfirm className="delete"
          title="Are you sure to delete this card ? (it can't be undone)" placement="left"
          onConfirm={() => this.deleteCard(card)}
          okText="Yes" cancelText="No">
          <Icon type="close" />
        </Popconfirm>
        <div className="content" onClick={() => this.selectCard(card)}>
          <h2>{card.name}</h2>
          <span>{card.description}</span>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="CardList">
        <h2 style={{color: 'white'}}>CardList</h2>
        <div className="cards">
          {this.props.cards.map(this.renderCardItem)}
        </div>
        <button className="new" onClick={this.addCard}>+</button>
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
