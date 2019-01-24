import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';
import DeckStorage from '../services/DeckStorage';

class CardEditor extends Component {

  state = {
    data: this.props.data
  }

  onSave = async (data) => {
    this.setState({ data });
  }

  render() {
    return !this.state.data ? (
      <div>
        No card selected
      </div>
    ) : (
      <Row>
        <Col span={12}><Card data={ this.state.data }/></Col>
        <Col span={12}><CardForm data={ this.state.data } onSave={this.onSave}/></Col>
      </Row>
    );
  }
}

export default CardEditor;
