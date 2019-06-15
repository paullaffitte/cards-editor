import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, Icon, Button, message } from 'antd';
import DeckActions from '../state/actions/deck';
import i18n from '../constants/i18n';

class ResourcesEditor extends Component {

  handleRemove = (file) => {
    this.props.dispatch(DeckActions.deleteResource(file.uid));
    return true;
  };

  handleAdd = ({file, onError, onSuccess}) => {
    const onErrorCustom = error => { onError(error, null, file); message.error(error) }
    if (Object.values(this.props.resources).map(resource => resource.path).includes(file.path))
      return onErrorCustom(i18n.t('resourcePicker.messages.alreadyExists'));

    this.props.dispatch(DeckActions.setResource({ path: file.path }));
    onSuccess();
  };

  render() {
    const fileList = Object.keys(this.props.resources).map(id => {
      const resource = this.props.resources[id];
      return {
        uid: resource.id,
        name: resource.path ? resource.path.split('/').pop() : '',
        status: 'done',
        url: 'file://' + resource.path,
        path: resource.path
      };
    });

    return (
      <div className="clearfix" style={ this.props.style }>
        <Upload
          customRequest={ this.handleAdd }
          listType="picture"
          fileList={ fileList }
          onPreview={ this.props.onPreview }
          onRemove={ this.handleRemove }
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
