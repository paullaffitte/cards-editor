import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { getCurrentDeck } from '../state/selectors/deck';

const { Footer } = Layout;

class StatusBar extends Component {

  componentDidMount() {
    document.originalTitle = document.title;
  }

  componentWillUpdate(nextProps) {
    document.title = nextProps.filename
      ? document.originalTitle + ' - ' + nextProps.filename.split('/').pop() + (nextProps.updated ? '*' : '')
      : document.originalTitle;
  }

  render() {
    return (
      <Footer style={{ height: this.props.height, padding: 0, paddingLeft: '0.5em', backgroundColor: 'white'}}>
        { [this.props.filename, this.props.updated ? 'unsaved changes' : ''].filter(Boolean).join(' - ') }
      </Footer>
    );
  }
}

const mapStateToProps = (state, props) => ({
  filename: getCurrentDeck(state).filename,
  updated: getCurrentDeck(state).updated,
});

export default connect(mapStateToProps)(StatusBar);
