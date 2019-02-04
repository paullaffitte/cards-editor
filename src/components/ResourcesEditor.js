import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, Icon, Modal } from 'antd';
import DeckActions from '../state/actions/deck';

class ResourcesEditor extends React.Component {

  state = {
    previewVisible: false,
    previewImage: ''
  };

  hideModal = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleRemove = (file) => {
    this.props.dispatch(DeckActions.removeResource(file.name));
    return true;
  };

  uploadFile = ({file, onError, onSuccess}) => {
    const onErrorCustom = error => { onError(error, null, file); alert(error) }
    if (Object.keys(this.props.resources).includes(file.name))
      onErrorCustom('Resource already exists.');

    this.props.dispatch(DeckActions.addResource({filename: file.name, path: file.path}));
    onSuccess();
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const fileList = Object.keys(this.props.resources).map(filename => ({
      uid: filename,
      name: filename,
      status: 'done',
      url: 'file://' + this.props.resources[filename]
    }));

    return (
      <div className="clearfix">
        <h2>Resources</h2>
        <Upload
          customRequest={this.uploadFile}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove}
        >
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.hideModal}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: state.deck.current.resources
});

export default connect(mapStateToProps)(ResourcesEditor);
