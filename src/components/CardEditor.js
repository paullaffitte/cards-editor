import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import Card from './Card';
import CardForm from './CardForm';
import DeckStorage from '../services/DeckStorage';
import DeckActions from '../state/actions/deck';

class CardEditor extends Component {

  onSave = data => this.props.dispatch(DeckActions.updateCard(data));

  render() {
    return !this.props.data ? (
      <div>
        No card selected
      </div>
    ) : (
      <Row>
        <Col span={12}><Card data={ this.props.data }/></Col>
        <Col span={12}><CardForm data={ this.props.data } onSave={this.onSave}/></Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  data: state.deck.editedCard
});

export default connect(mapStateToProps)(CardEditor);
