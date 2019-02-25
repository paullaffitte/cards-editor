import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';

class CardEditor extends Component {

  render() {
    return !this.props.data ? (
      <div>
        No card selected
      </div>
    ) : (
      <Row>
        <Col span={12}><Card { ...this.props.data }/></Col>
        <Col span={12}><CardForm data={ this.props.data }/></Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  data: state.deck.editedCard
});

export default connect(mapStateToProps)(CardEditor);
