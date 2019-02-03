import React, { Component } from 'react';
import { connect } from 'react-redux';
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
        {this.props.count}
        <Col span={12}><Card data={ this.props.data }/></Col>
        <Col span={12}><CardForm data={ this.props.data } onSave={data => this.props.dispatch({type: 'SAVE', data})}/></Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  count: state.count
});

export default connect(mapStateToProps)(CardEditor);
