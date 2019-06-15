import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon, Modal, Button } from 'antd';
import { Translation } from 'react-i18next';
import ResourcesEditor from './ResourcesEditor'
import { getResources, getProjectDirectory } from '../state/selectors/deck';

class ResourcePicker extends Component {

  state = {
    preview: {
      name: null,
      url: null,
      path: null
    },
    modalOpened: false
  };

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  onPreview = ({ name, url, path }) => {
    this.setState({ preview: {name, url, path} });
  };

  toggleModal = visible => {
    if (visible && this.props.value) {
      if (!(this.props.value in this.props.resources))
        alert(`Error: Resource ${this.props.value} not found`);
      else {
        const { name, url, path } = this.props.resources[this.props.value];
        const preview = { name, url, path };
        this.setState({ preview });
      }
    }

    this.setState({ modalOpened: visible !== undefined ? (visible === true) : !this.state.modalOpened });
  };

  onSubmit = () => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(this.state.preview.name);
    }
    this.toggleModal(false);
  };

  onCancel = () => this.toggleModal(false);

  render() {
    const { preview, modalOpened } = this.state;
    const { projectDirectory } = this.props;
    const previewPath = preview.path && preview.path.indexOf(projectDirectory) === 0
      ? preview.path.slice(projectDirectory.length)
      : preview.path;

    return (
      <Translation>
        { t => (
          <Fragment>
            <div>{ this.state.value }</div>
            <Button onClick={() => this.toggleModal(true)}>
              <Icon type="search" /> { t('resourcePicker.choose') }
            </Button>

            <Modal
              visible={ modalOpened }
              width='900px'
              onCancel={ this.onCancel }
              footer={ [
                <Button key="back" onClick={ this.onCancel }>{ t('resourcePicker.cancel') }</Button>,
                <Button key="submit" type="primary" onClick={ this.onSubmit }>{ t('resourcePicker.select') }</Button>,
              ] }>
              <h2>Resources</h2>
              <Row>
              <Col span={14}>
                <ResourcesEditor selected={this.state.value} onPreview={this.onPreview} style={{ marginBottom: '1em' }} />
              </Col>
              <Col span={9} offset={1}>
                { preview.url ? (
                  <img alt="example" style={{ width: '100%' }} src={ preview.url } />
                ) : null }
                <span>{ previewPath }</span>
              </Col>
              </Row>
            </Modal>
          </Fragment>
        ) }
      </Translation>
    );
  }
}

const mapStateToProps = (state, props) => ({
  projectDirectory: getProjectDirectory(state),
  resources: getResources(state)
});

export default connect(mapStateToProps)(ResourcePicker);
