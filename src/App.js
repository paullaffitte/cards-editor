import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import DeckEditor from './components/DeckEditor';
import DeckStorage from './services/DeckStorage';

const { Header, Footer } = Layout;

DeckStorage.registerListeners();

class App extends Component {

  render() {
    return (
      <Layout className="app">
        <Header></Header>
        <DeckEditor></DeckEditor>
        <Footer></Footer>
      </Layout>
    );
  }
}

export default App;
