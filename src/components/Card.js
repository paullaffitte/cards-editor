import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceByName, getEffectsByIds } from '../state/selectors/deck';
import '../styles/Card.scss';

class Card extends Component {

  state = {
    images: {
      background: { ratio: 1 }
    }
  }

  updateImage = name => async image => {
    await this.setState({images: {...this.state.images, [name]: {
      ratio: image.target.naturalHeight / image.target.naturalWidth,
      height: image.target.naturalHeight,
      width: image.target.naturalWidth
    }}});
  }

  getThumbnailStyle() {
    const userToPercent = num => parseInt(num ? num : '0') + '%';
    const thumbnail = this.state.images.thumbnail ? this.state.images.thumbnail : {
      width: 1,
      height: 1
    };

    const thumbnailScale = this.props.thumbnailScale ? this.props.thumbnailScale : 1;
    return {
      width: thumbnail.width * thumbnailScale,
      height: thumbnail.height * thumbnailScale,
      top: userToPercent(this.props.thumbnailY),
      left: userToPercent(this.props.thumbnailX),
    };
  }

  render() {
    const effects = this.props.effects.map(({ description }) => description).filter(Boolean).join('. ');
    return (
      <div className="Card" style={{ ...this.props.style, paddingTop: `calc(${this.state.images.background.ratio} * 100%)`}}>
        <img className="thumbnail" src={ this.props.thumbnail } onLoad={ this.updateImage("thumbnail") } style={ this.getThumbnailStyle() } />
        <img className="background" src={ this.props.background } onLoad={ this.updateImage("background") } />
        <div className="informations">
          <h3>{this.props.name}</h3>
          <div>{effects}{effects ? (<span>.<br /></span>) : ''}{this.props.description}</div>
          <div>HP: {this.props.hp}</div>
          <div>Attack: {this.props.attack}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  thumbnail: getResourceByName(state, props.thumbnail),
  background: getResourceByName(state, props.background),
  effects: getEffectsByIds(state, props.effects)
});

export default connect(mapStateToProps)(Card);
