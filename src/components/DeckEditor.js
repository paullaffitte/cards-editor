import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Modal, Tabs } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';
import DeckStorage from '../services/DeckStorage';
import DeckActions from '../state/actions/deck';
import ActionsTypes from '../constants/ActionsTypes';

const { Sider, Content } = Layout;
const TabPane = Tabs.TabPane;

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

  addCard = () => this.props.dispatch(DeckActions.addItem(ActionsTypes.Item.CARD));

  render() {
    return (
      <Layout>
        <Content>
          <CardEditor/>
        </Content>
        <Sider width={250}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Minions" key="1"></TabPane>
            <TabPane tab="Spells" key="2"></TabPane>
          </Tabs>
          <CardList/>
          <button className="new" onClick={this.addCard}>+</button>
        </Sider>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck.current
});

export default connect(mapStateToProps)(DeckEditor);
