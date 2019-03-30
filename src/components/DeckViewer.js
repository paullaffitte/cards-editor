import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import Card from './Card';

class DeckViewer extends Component {

  render() {
    return (
      <div>
        { this.props.deck.cards.map(card => {
          return (
            <div style={{ pageBreakInside: 'avoid', paddingTop: '1em', paddingLeft: '1em' }} >
              <Card key={ card.id } { ...card } />
            </div>
          );
        }) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck.current
});

export default connect(mapStateToProps)(DeckViewer);
