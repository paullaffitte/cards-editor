import React, { Component } from 'react';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import '../styles/List.scss';

class List extends Component {

  renderItem = item => {
    const backgroundImage = item.thumbnail ? {backgroundImage: `url('${item.thumbnail}')`} : null;
    const className       = 'list-item ' + item.className;

    return (
      <div key={item.id} className={className} style={backgroundImage}>
        <Popconfirm className="delete"
          title="Are you sure to delete this item ? (it can't be undone)" placement="left"
          onConfirm={() => this.props.deleteItem(item)}
          okText="Yes" cancelText="No">
          <Icon type="close" />
        </Popconfirm>
        <div className="content" onClick={() => this.props.selectItem(item)}>
          <h2>{item.name}</h2>
          <span>{item.description}</span>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="List">
        <h2 style={{color: 'white'}}>List</h2>
        <div className="items">
          {this.props.items.map(this.renderItem)}
        </div>
        <button className="new" onClick={this.props.addItem}>+</button>
      </div>
    );
  }
}

export default List;
