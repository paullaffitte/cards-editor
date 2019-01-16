import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import CardList from './components/CardList';
import CardEditor from './components/CardEditor';
import exampleCard from './example_card.json';

const { Header, Footer, Sider, Content } = Layout;

class App extends Component {

  state = {
    editedCard: exampleCard
  };

  render() {
    return (
      <Layout className="app">
        <Header></Header>
        <Layout>
          <Content>
            <CardEditor data={ this.state.editedCard }/>
          </Content>
          <Sider><CardList/></Sider>
        </Layout>
        <Footer></Footer>
      </Layout>
    );
  }
}

export default App;
