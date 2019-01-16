import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';

class CardEditor extends Component {

  state = {
    data: this.props.data
  }

  onSave = (data) => {
    this.setState({ data });
  }

  render() {
    return (
      <Row>
        <Col span={12}><Card data={ this.state.data }/></Col>
        <Col span={12}><CardForm data={ this.state.data } onSave={this.onSave}/></Col>
      </Row>
    );
  }
}

export default CardEditor;
