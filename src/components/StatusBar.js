import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { getCurrentDeck } from '../state/selectors/deck';

const { Footer } = Layout;

class StatusBar extends Component {

  componentDidMount() {
    if (!document.originalTitle)
      document.originalTitle = document.title;
  }

  componentWillUpdate(nextProps) {
    document.title = nextProps.filename
      ? document.originalTitle + ' - ' + nextProps.filename.split('/').pop() + (nextProps.updated ? '*' : '')
      : document.originalTitle;
  }

  render() {
    return (
      <Footer style={{ height: this.props.height, padding: 0, paddingLeft: '0.2em', backgroundColor: 'white'}}>
        { [this.props.filename, this.props.updated ? 'unsaved changes' : ''].filter(Boolean).join(' - ') }
        <span style={{ float: 'right', paddingRight: '0.2em' }}>deck version: { this.props.version }</span>
      </Footer>
    );
  }
}

const mapStateToProps = (state, props) => {
  const deck = getCurrentDeck(state);
  return {
    filename: deck.filename,
    updated: deck.updated,
    version: deck.version
  }
};

export default connect(mapStateToProps)(StatusBar);
