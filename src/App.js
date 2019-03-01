import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import reducers from './state/reducers/index';
import DeckEditor from './components/DeckEditor';

const { Header } = Layout;

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

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
