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
      onOpen:         this.onOpen,        // TODO  move this code in App
      onSave:         this.onSave,        //       create a ContextListener class and move register listener inside it
      updateFilename: this.updateFilename //       use DeckStorage in onOpen or onSave callbacks
    });
  }

  onOpen = (deck) => {
    if (!deck)
      return;

    this.props.dispatch(DeckActions.openDeck(deck));
  };

  onSave = () => {
    this.props.dispatch(DeckActions.stageCards());
    return this.props.deck;
  };

  updateFilename = filename => {
    this.props.dispatch(DeckActions.updateFilename(filename));
  };

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
  deck: state.deck.current
});

export default connect(mapStateToProps)(DeckEditor);
