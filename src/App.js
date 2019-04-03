import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Layout, Modal } from 'antd';
import 'antd/dist/antd.css';
import './App.scss';
import reducers from './state/reducers/index';
import { getCurrentDeck } from './state/selectors/deck';
import DeckEditor from './components/DeckEditor';
import DeckViewer from './components/DeckViewer';
import StatusBar from './components/StatusBar';
import DeckStorage from './services/DeckStorage';

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

DeckStorage.initFonts(store);
DeckStorage.onQuit(quit => getCurrentDeck(store.getState()).updated ? Modal.confirm({
  title: 'Confirmation',
  content: 'Your deck has unsaved changes. If you quit now, these changes will be lost',
  okText: 'Quit',
  onOk: quit
}) : quit());

class App extends Component {

  state = {
    exportMode: false
  }

  render() {
    return (
      <Provider store={store}>
        { !this.state.exportMode
          ? (
            <Layout className="app">
              <DeckEditor toggleExportMode={ exportMode => this.setState({ exportMode }) } />
              <StatusBar height='1.5em' />
            </Layout>
          )
          : (<DeckViewer style={{ backgroundColor: 'white' }} />)
        }
      </Provider>
    );
  }
}

export default App;
