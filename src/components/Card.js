import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceByName, getEffectsByIds } from '../state/selectors/deck';
import '../styles/Card.scss';

const userToUnit = unit => num => parseInt(num ? num : '0') + unit;

class Card extends Component {

  state = {
    sizes: {
      background: { width: 0, height: 0 },
      thumbnail: { width: 0, height: 0 },
    },
    scale: 1
  }

  updateImage = name => image => {
    this.setState({sizes: {...this.state.sizes, [name]: {
      height: image.target.naturalHeight,
      width: image.target.naturalWidth
    }}});

    if (this.props.width && name == 'background') {
      this.setState({ scale: 1 / image.target.naturalWidth * this.props.width });
    }
  }

  getThumbnailStyle() {
    const userToPercent = userToUnit('%');
    const thumbnail = this.state.sizes.thumbnail;
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
    let size = this.state.sizes.background;

    return (
      <div className="Card" style={{ ...this.props.style, width: size.width, height: size.height, transform: `scale(${this.state.scale})` }}>
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
