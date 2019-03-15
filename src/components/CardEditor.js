import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';
import { getEditedCard } from '../state/selectors/deck'

class CardEditor extends Component {

  render() {
    return !this.props.data.id ? (
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
  data: getEditedCard(state),
  state: state
});

export default connect(mapStateToProps)(CardEditor);
