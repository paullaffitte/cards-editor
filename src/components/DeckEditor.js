import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Modal, Tabs } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';
import ExportModal from './ExportModal';
import DeckStorage from '../services/DeckStorage';
import Wrapper from '../services/Wrapper';
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
    Wrapper.on('new', this.onNew);
    Wrapper.on('open', this.onOpen);
    Wrapper.on('save', this.onSave);
    Wrapper.on('saveAs', this.onSaveAs);
    Wrapper.on('exportAsPDF', this.onExport);
  }

  componentWillUnmount() {
    Wrapper.off('new', this.onNew);
    Wrapper.off('open', this.onOpen);
    Wrapper.off('save', this.onSave);
    Wrapper.off('saveAs', this.onSaveAs);
    Wrapper.off('exportAsPDF', this.onExport);
  }

  onNew = () => {
    const newDeck = () => this.props.dispatch(DeckActions.newDeck());

    if (this.props.deck.updated) {
      Modal.confirm({
        title: 'Confirmation',
        content: 'Your deck has unsaved changes. If you create a new deck now, these changes will be lost',
        okText: 'New deck',
        onOk : close => {
          newDeck();
          close();
        }
      });
    } else {
      newDeck();
    }
  };

  onOpen = async (event, filename) => {
    const deck = await DeckStorage.open(filename);

    if (deck)
      this.props.dispatch(DeckActions.openDeck(deck));
  };

  onSave = async () => this.afterSave(await DeckStorage.save(this.props.deck));

  onSaveAs = async () => this.afterSave(await DeckStorage.saveAs(this.props.deck));

  afterSave = filename => {
    if (filename)
      this.updateFilename(filename);
  }

  onExport = () => {
    this.props.dispatch(DeckActions.updateCardSize());
    this.openExportModal();
  };

  exportAsPDF = async () => {
    this.closeExportModal();
    this.props.toggleExportMode(true);
    const filename = await DeckStorage.exportAsPDF();
    this.props.toggleExportMode(false);

    if (!filename)
      this.openExportModal()
  };

  openExportModal = () => this.setState({ showExport: true });
  closeExportModal = () => this.setState({ showExport: false });

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
