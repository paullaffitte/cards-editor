import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from './Card';
import CardForm from './CardForm';
import { getEditedCard } from '../state/selectors/deck'
import '../styles/CardEditor.scss';

class CardEditor extends Component {

  render() {
    const cardWidth = 400;
    const cardCssWidth = `${cardWidth}px + 4em`;

    return !this.props.data.id ? (
      <div className="CardEditor">
        No card selected
      </div>
    ) : (
      <div className="CardEditor">
        <div className="panel card-preview" style={{ width: `calc(${cardCssWidth})` }}>
          <Card data={ this.props.data } width={ cardWidth } />
        </div>
        <div className="panel" style={{ width: `calc(100% - (${cardCssWidth}))` }}>
          <CardForm data={ this.props.data } />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: getEditedCard(state),
  state: state
});

export default connect(mapStateToProps)(CardEditor);
