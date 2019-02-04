import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';
import DeckStorage from '../services/DeckStorage';
import DeckActions from '../state/actions/deck';

const { Sider, Content } = Layout;

class DeckEditor extends Component {

  componentDidMount() {
    DeckStorage.registerListeners({
      onOpen: this.onOpen,
      onSave: this.onSave
    });
  }

  onOpen = (deck) => {
    if (!deck)
      return;

    this.props.dispatch(DeckActions.openDeck(deck));
  }

  onSave = () => {
    return this.props.deck;
  }

  render() {
    return (
      <Layout>
        <Content>
          <CardEditor/>
        </Content>
        <Sider><CardList/></Sider>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck ? state.deck.current : null,
  editedCard: state.deck ? state.deck.editedCard : null
});

export default connect(mapStateToProps)(DeckEditor);
