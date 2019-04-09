import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceById, getEffectsByIds, getCardsConfig } from '../state/selectors/deck';
import '../styles/Card.scss';

const userToUnit = unit => num => parseInt(num ? num : '0') + unit;
const userToPercent = userToUnit('%');
const userToPt = userToUnit('pt');

class Card extends Component {

  getScale() {
    return this.props.background.width && this.props.width
      ? 1 / this.props.background.width * this.props.width
      : 1;
  }

  getThumbnailStyle() {
    const { width, height } = this.props.thumbnail;
    const transform = this.props.thumbnailTransform ? this.props.thumbnailTransform : {};
    const thumbnailScale = transform.scale ? transform.scale : 1;

    return {
      width: (width ? width : 0) * thumbnailScale,
      height: (height ? height : 0) * thumbnailScale,
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
    const { width, height } = this.props.background;
    const cardStyle = {
      ...this.props.style,
      width: width ? width : this.props.cardSize.width,
      height: height ? height : this.props.cardSize.height,
      transform: `scale(${this.getScale()})`
    };

    return (
      <div className="Card" style={cardStyle}>
        {this.props.thumbnail.src ? <img
          alt="thumbnail"
          className="thumbnail positionable"
          src={ this.props.thumbnail.src }
          style={ this.getThumbnailStyle() } />
        : null}
        {this.props.background.src ? <img
          alt="background"
          className="background"
          src={ this.props.background.src } />
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
    thumbnail: getResourceById(state, props.thumbnail),
    background: getResourceById(state, props.background),
    effects: getEffectsByIds(state, props.effects),
    cardSize: state.deck.cardSize,
    ...transforms
  }
};

export default connect(mapStateToProps)(Card);
