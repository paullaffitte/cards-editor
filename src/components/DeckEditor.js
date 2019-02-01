import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';
import DeckStorage from '../services/DeckStorage';

const { Sider, Content } = Layout;

class DeckEditor extends Component {

  state = {
    deck: null,
    editedCard: null,
  };

  lastCardId = 0;

  componentDidMount() {
    DeckStorage.registerListeners({
      onOpen: this.onOpen,
      onSave: this.onSave
    });
  }

  onOpen = (deck) => {
    if (!deck)
      return;

    this.lastCardId = 0;
    deck = deck.map(card => ({...card, id: ++this.lastCardId}));
    this.setState({deck});
    if (deck.length) {
      this.setState({editedCard: deck[0]});
    }
  }

  onSave = () => {
    return this.state.deck;
  }

  updateCard = (newCard) => {
    if (!newCard.id)
      newCard.id = ++this.lastCardId;

    let updatedDeck = this.state.deck.map(card => (card.id != newCard.id) ? card : newCard);
    this.setState({deck: updatedDeck, editedCard: newCard});
  }

  render() {
    return (
      <Layout>
        <Content>
          <CardEditor data={ this.state.editedCard } onSave={ this.updateCard }/>
        </Content>
        <Sider><CardList/></Sider>
      </Layout>
    );
  }
}

export default DeckEditor;
