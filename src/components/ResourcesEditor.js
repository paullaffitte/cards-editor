import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, Icon, Modal, Button } from 'antd';
import DeckActions from '../state/actions/deck';

class ResourcesEditor extends React.Component {

  handleRemove = (file) => {
    this.props.dispatch(DeckActions.removeResource(file.name));
    return true;
  };

  handleAdd = ({file, onError, onSuccess}) => {
    const onErrorCustom = error => { onError(error, null, file); alert(error) }
    if (Object.keys(this.props.resources).includes(file.name))
      onErrorCustom('Resource already exists.');

    this.props.dispatch(DeckActions.addResource({filename: file.name, path: file.path}));
    onSuccess();
  };

  render() {
    const fileList = Object.keys(this.props.resources).map(filename => ({
      uid: filename,
      name: filename,
      status: 'done',
      url: 'file://' + this.props.resources[filename]
    }));

    return (
      <div className="clearfix" style={this.props.style}>
        <Upload
          customRequest={this.handleAdd}
          listType="picture"
          fileList={fileList}
          onPreview={this.props.onPreview}
          onRemove={this.handleRemove}
        >
          <Button>
            <Icon type="upload" /> Upload
          </Button>
        </Upload>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: state.deck.current.resources
});

export default connect(mapStateToProps)(ResourcesEditor);
