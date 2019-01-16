import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import Card from './components/Card';
import CardList from './components/CardList';
import CardEditor from './components/CardEditor';

const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className="app">
        <Header></Header>
        <Layout>
          <Content>
            <Row>
              <Col span={12}><Card/></Col>
              <Col span={12}><CardEditor/></Col>
            </Row>
          </Content>
          <Sider><CardList/></Sider>
        </Layout>
        <Footer></Footer>
      </Layout>
    );
  }
}

export default App;
