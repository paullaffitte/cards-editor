import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';
import DeckStorage from '../services/DeckStorage';

class CardEditor extends Component {

  render() {
    return !this.props.data ? (
      <div>
        No card selected
      </div>
    ) : (
      <Row>
        <Col span={12}><Card data={ this.props.data }/></Col>
        <Col span={12}><CardForm data={ this.props.data } onSave={data => this.props.onSave(data)}/></Col>
      </Row>
    );
  }
}

export default CardEditor;
