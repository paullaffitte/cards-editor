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
import ResourceLoader from './components/ResourceLoader';
import DeckActions from './state/actions/deck';
import Wrapper from './services/Wrapper';

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

const quit = () => Wrapper.send('quit');

Wrapper.init();
Wrapper.on('availableFonts', (e, fonts) => store.dispatch(DeckActions.updateAvailableFonts(fonts)));
Wrapper.on('quit', () => getCurrentDeck(store.getState()).updated ? Modal.confirm({
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
        <Layout className="app" style={{ display: this.state.exportMode ? 'none' : undefined }}>
          <DeckEditor toggleExportMode={ exportMode => this.setState({ exportMode }) } />
          <StatusBar height='2em' />
        </Layout>
        { this.state.exportMode
          ? (<DeckViewer style={{ backgroundColor: 'white' }} />)
          : null
        }
        <ResourceLoader />
      </Provider>
    );
  }
}

export default App;
