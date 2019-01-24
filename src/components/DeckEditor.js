import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import CardList from './CardList';
import CardEditor from './CardEditor';

const { Sider, Content } = Layout;

class DeckEditor extends Component {

  state = {
    deck: null,
    editedCard: null,
  };

  render() {
    return (
        <Layout>
          <Content>
            <CardEditor data={ this.state.editedCard }/>
          </Content>
          <Sider><CardList/></Sider>
        </Layout>
    );
  }
}

export default DeckEditor;
