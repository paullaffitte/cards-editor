import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Modal } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';
import DeckStorage from '../services/DeckStorage';
import DeckActions from '../state/actions/deck';
import ActionsTypes from '../constants/ActionsTypes';

const { Sider, Content } = Layout;

class DeckEditor extends Component {

  componentDidMount() {
    DeckStorage.registerListeners({
      onNew:          this.onNew,
      onOpen:         this.onOpen,        // TODO  move this code in App
      onSave:         this.onSave,        //       create a ContextListener class and move register listener inside it
      updateFilename: this.updateFilename //       use DeckStorage in onOpen or onSave callbacks
    });
  }

  onNew = () => {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure to create a new deck. This will discard current changes if there are any.',
      okText: 'New deck',
      onOk : close => {
        this.props.dispatch(DeckActions.newDeck())
        close();
      }
    });
  };

  onOpen = (deck) => {
    if (!deck)
      return;

    this.props.dispatch(DeckActions.openDeck(deck));
  };

  onSave = () => {
    return this.props.deck;
  };

  updateFilename = filename => {
    if (!filename)
      return;

    this.props.dispatch(DeckActions.updateFilename(filename));
    for (let itemType in ActionsTypes.Item)
      this.props.dispatch(DeckActions.stageItems(itemType));
  };

  render() {
    return (
      <Layout>
        <Content>
          <CardEditor/>
        </Content>
        <Sider width={250}><CardList/></Sider>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck.current
});

export default connect(mapStateToProps)(DeckEditor);
