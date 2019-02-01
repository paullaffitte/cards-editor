import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Modal, Tabs } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';
import ExportModal from './ExportModal';
import DeckStorage from '../services/DeckStorage';
import DeckActions from '../state/actions/deck';
import ActionsTypes from '../constants/ActionsTypes';

const { Sider, Content } = Layout;
const TabPane = Tabs.TabPane;

class DeckEditor extends Component {

  state = {
    cardType: 'minion',
    showExport: false
  };

  componentDidMount() {
    DeckStorage.registerListeners({
      onNew:          this.onNew,
      onOpen:         this.onOpen,        // TODO  move this code in App
      onSave:         this.onSave,        //       create a ContextListener class and move register listener inside it
      onExport:       this.onExport,      //       use DeckStorage in onOpen or onSave callbacks
      updateFilename: this.updateFilename
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

  onExport = () => this.setState({ showExport: true });

  exportAsPDF = async () => {
    await DeckStorage.exportAsPDF()
    this.closeExportModal();
  };

  closeExportModal = () => {
    if (this.exportResponse)
      this.exportResponse.resolve(false);
    this.setState({ showExport: false });
  }

  updateFilename = filename => {
    if (!filename)
      return;

    this.props.dispatch(DeckActions.updateFilename(filename));
    for (let itemType in ActionsTypes.Item)
      this.props.dispatch(DeckActions.stageItems(itemType));
  };

  addCard = () => this.props.dispatch(DeckActions.addItem(ActionsTypes.Item.CARD, { type: this.state.cardType }));

  onChangeCardType = (type) => this.setState({ cardType: type })

  render() {
    return (
      <Layout>
        <Content>
          <CardEditor/>
          <ExportModal visible={ this.state.showExport } onExport={ this.exportAsPDF } onCancel={ this.closeExportModal } />
        </Content>
        <Sider width={250}>
          <Tabs defaultActiveKey={ this.state.cardType } onChange={ this.onChangeCardType }>
            <TabPane tab="Minions" key="minion"></TabPane>
            <TabPane tab="Spells" key="spell"></TabPane>
          </Tabs>
          <CardList cardsType={ this.state.cardType } />
          <button className="new" onClick={ this.addCard }>+</button>
        </Sider>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck.current
});

export default connect(mapStateToProps)(DeckEditor);
