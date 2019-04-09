import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Button } from 'antd';
import { getCurrentDeck } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import semver from 'semver'
import '../styles/StatusBar.scss';
const { shell } = window.require('electron');

const { Footer } = Layout;

class StatusBar extends Component {

  state = {
    latest: null,
    latestUrl: null
  }

  async componentDidMount() {
    if (!document.originalTitle)
      document.originalTitle = document.title;

    const latestUrl = (await fetch('https://github.com/paullaffitte/cards-editor/releases/latest')).url;
    const latest = latestUrl.split('/').pop();
    const upgradeAvailable = semver.lt(window.appVersion, latest);

    if (upgradeAvailable)
      this.setState({ latest, latestUrl });
  }

  componentWillUpdate(nextProps) {
    document.title = nextProps.filename
      ? document.originalTitle + ' - ' + nextProps.filename.split('/').pop() + (nextProps.updated ? '*' : '')
      : document.originalTitle;
  }

  doUpdate = () => shell.openExternal(this.state.latestUrl);

  render() {
    return (
      <Footer className="StatusBar" style={{ height: this.props.height, lineHeight: this.props.height}}>
        { [this.props.filename, this.props.updated ? 'unsaved changes' : ''].filter(Boolean).join(' - ') }

        <div className="version">
          { this.state.latest
            ? (
            <Button type='primary' className="update-button" onClick={ this.doUpdate }>
              <span>update available ({ window.appVersion } -> { this.state.latest })</span>
            </Button>
          ) : <span className="current-version">{ window.appVersion }</span> }
        </div>
      </Footer>
    );
  }
}

const mapStateToProps = (state, props) => {
  const deck = getCurrentDeck(state);
  return {
    filename: deck.filename,
    updated: deck.updated,
    version: deck.version,
    latestVersion: state.latestVersion
  }
};

export default connect(mapStateToProps)(StatusBar);
