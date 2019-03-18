import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';
import { getEditedCard } from '../state/selectors/deck'
import '../styles/CardEditor.scss';

class CardEditor extends Component {

  render() {
    return !this.props.data.id ? (
      <div className="CardEditor">
        No card selected
      </div>
    ) : (
      <Row className="CardEditor">
        <Col span={10} className="column left"><Card { ...this.props.data } /></Col>
        <Col span={14} className="column right"><CardForm data={ this.props.data } /></Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  data: getEditedCard(state),
  state: state
});

export default connect(mapStateToProps)(CardEditor);
