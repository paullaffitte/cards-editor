import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.scss';
import reducers from './state/reducers/index';
import DeckEditor from './components/DeckEditor';
import DeckViewer from './components/DeckViewer';

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

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
            </Layout>
          )
          : (<DeckViewer style={{ backgroundColor: 'white' }} />)
        }
      </Provider>
    );
  }
}

export default App;
