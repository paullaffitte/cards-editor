import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Button, Tag } from 'antd';
import { withTranslation } from 'react-i18next';
import semver from 'semver'
import Wrapper from '../services/Wrapper';
import { getCurrentDeck } from '../state/selectors/deck';
import '../styles/StatusBar.scss';

const { Footer } = Layout;

class StatusBar extends Component {

  state = {
    latest: null,
    latestUrl: null
  }

  async componentDidMount() {
    if (!document.originalTitle)
      document.originalTitle = document.title;

    const response = await fetch('https://api.github.com/repos/paullaffitte/cards-editor/releases/latest');
    const { html_url: latestUrl, tag_name: latest } = await response.json();
    const upgradeAvailable = semver.valid(window.appVersion) ? semver.lt(window.appVersion, latest) : false;

    if (upgradeAvailable)
      this.setState({ latest, latestUrl });
  }

  componentWillUpdate(nextProps) {
    document.title = nextProps.filename
      ? document.originalTitle + ' - ' + nextProps.filename.split('/').pop() + (nextProps.updated ? '*' : '')
      : document.originalTitle;
  }

  doUpdate = () => Wrapper.openUrl(this.state.latestUrl);

  render() {
    const { t } = this.props;

    return (
      <Footer className="StatusBar" style={{ height: this.props.height, lineHeight: this.props.height}}>
        { [this.props.filename, this.props.updated ? t('unsavedChanges') : ''].filter(Boolean).join(' - ') }

        <div className="version">
          { this.state.latest
            ? (
            <Button type='primary' className="update-button" onClick={ this.doUpdate }>
              <span>update available ({ window.appVersion } -> { this.state.latest })</span>
            </Button>
          ) : <Tag>{ window.appVersion }</Tag> }
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

export default withTranslation()(connect(mapStateToProps)(StatusBar));
