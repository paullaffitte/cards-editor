import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceByName, getEffectsByIds, getCardsConfig } from '../state/selectors/deck';
import '../styles/Card.scss';

const userToUnit = unit => num => parseInt(num ? num : '0') + unit;
const userToPercent = userToUnit('%');
const userToPt = userToUnit('pt');

class Card extends Component {

  state = {
    sizes: {
      background: { width: 400, height: 600 },
      thumbnail: { width: 0, height: 0 },
    }
  }

  getScale() {
    return this.props.width
      ? 1 / this.state.sizes.background.width * this.props.width
      : 1;
  }

  updateImage = name => image => {
    this.setState({sizes: {...this.state.sizes, [name]: {
      height: image.target.naturalHeight,
      width: image.target.naturalWidth
    }}});
  }

  getThumbnailStyle() {
    const thumbnail = this.state.sizes.thumbnail;
    const transform = this.props.thumbnailTransform ? this.props.thumbnailTransform : {};
    const thumbnailScale = transform.scale ? transform.scale : 1;

    return {
      width: thumbnail.width * thumbnailScale,
      height: thumbnail.height * thumbnailScale,
      top: userToPercent(transform.y),
      left: userToPercent(transform.x),
    };
  }

  renderText = (name, customValue) => {
    const transform = {
      x: 50,
      y: 50,
      scale: 12,
      ...this.props[`${name}Transform`]
    };

    return (
      <div className={name + ' positionable'} style={{
        left: userToPercent(transform.x),
        top: userToPercent(transform.y),
        fontSize: userToPt(transform.scale),
        color: transform.color,
        fontFamily: transform.font
      }}>
        {customValue ? customValue : this.props[name]}
      </div>
    );
  };

  render() {
    const effects = this.props.effects.map(({ description }) => description).filter(Boolean).join('. ');
    let size = this.state.sizes.background;
    const cardStyle = {
      ...this.props.style,
      width: size.width,
      height: size.height,
      transform: `scale(${this.getScale()})`
    };

    return (
      <div className="Card" style={cardStyle}>
        {this.props.thumbnail ? <img
          alt="thumbnail"
          className="thumbnail positionable"
          src={ this.props.thumbnail }
          onLoad={ this.updateImage("thumbnail") }
          style={ this.getThumbnailStyle() } />
        : null}
        {this.props.background ? <img
          alt="background"
          className="background"
          src={ this.props.background }
          onLoad={ this.updateImage("background") } />
        : null}
        {this.renderText('name')}
        {this.renderText('description', [effects, effects ? '.\n' : '', this.props.description])}
        {this.props.type === 'minion' ? (
          <div>
            {this.renderText('hp')}
            {this.renderText('attack')}
          </div>
        ): null}
      </div>
    );
  }
}

function mergeTransforms(transforms) {
  const transform = {};

  ['x', 'y', 'scale', 'color', 'font'].forEach(field => {
    const value = transforms
      .filter(Boolean)
      .map(({ [field]: value }) => value)
      .filter(Boolean)
      .shift();

    if (value)
      transform[field] = value;
  });

  return transform;
}

const mapStateToProps = (state, props) => {
  const cardsConfig = getCardsConfig(state);
  const transforms = ['name', 'description', 'attack', 'hp'].reduce((acc, name) => {
    const transformName = name + 'Transform';
    const transform = mergeTransforms([props[transformName], cardsConfig[transformName]]);
    return { ...acc, [transformName]: transform }
  }, {});

  return {
    thumbnail: getResourceByName(state, props.thumbnail),
    background: getResourceByName(state, props.background),
    effects: getEffectsByIds(state, props.effects),
    ...transforms
  }
};

export default connect(mapStateToProps)(Card);
