import React, { Component } from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import reducers from './state/reducers/index';
import DeckEditor from './components/DeckEditor';

const { Header } = Layout;

const store = createStore(reducers);

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Layout className="app">
          <Header></Header>
          <DeckEditor></DeckEditor>
        </Layout>
      </Provider>
    );
  }
}

export default App;
