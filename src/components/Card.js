import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getItemById, getResourceById, getEffectsByIds } from '../state/selectors/deck';
import '../styles/Card.scss';

const userToUnit = unit => num => parseInt(num ? num : '0') + unit;
const userToPercent = userToUnit('%');
const userToPt = userToUnit('pt');

class Card extends Component {

  getScale() {
    return this.props.data.background.width && this.props.width
      ? 1 / this.props.data.background.width * this.props.width
      : 1;
  }

  getThumbnailStyle() {
    const { width, height } = this.props.data.thumbnail;
    const transform = this.props.data.thumbnailTransform ? this.props.data.thumbnailTransform : {};
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
      ...this.props.data[`${name}Transform`]
    };

    return (
      <div className={name + ' positionable'} style={{
        left: userToPercent(transform.x),
        top: userToPercent(transform.y),
        fontSize: userToPt(transform.scale),
        color: transform.color,
        fontFamily: transform.font
      }}>
        {customValue ? customValue : this.props.data[name]}
      </div>
    );
  };

  render() {
    const card = this.props.data;
    const effects = card.effects.map(({ description }) => description).filter(Boolean).join('. ');
    const { width, height } = card.background;
    const cardStyle = {
      ...card.style,
      width: width ? width : this.props.cardSize.width,
      height: height ? height : this.props.cardSize.height,
      transform: `scale(${this.getScale()})`
    };

    return (
      <div className="Card" style={cardStyle}>
        {card.thumbnail.src ? <img
          alt="thumbnail"
          className="thumbnail positionable"
          src={ card.thumbnail.src }
          style={ this.getThumbnailStyle() } />
        : null}
        {card.background.src ? <img
          alt="background"
          className="background"
          src={ card.background.src } />
        : null}
        {this.renderText('name')}
        {this.renderText('description', [effects, effects ? '.\n' : '', card.description])}
        {card.type === 'minion' ? (
          <div>
            {this.renderText('hp')}
            {this.renderText('attack')}
          </div>
        ): null}
      </div>
    );
  }
}

function mergeTransforms(t1, t2) {
  const transform = {};

  ['x', 'y', 'scale', 'color', 'font'].forEach(field => {
    if (t1) {
      transform[field] = t1[field];
    } else if (t2) {
      transform[field] = t2[field];
    }
  });

  return transform;
}

function mergeCards(...cards) {
  return cards.reduce((acc, card) => {
    Object.keys(card).forEach(key => {
      if (typeof card[key] == 'string' && card[key].length == 0)
        delete card[key];
    });
    return { ...card, ...acc }
  }, {});
};

const mapStateToProps = (state, props) => {
  const models = props.data.models.map(id => getItemById(state, { type: 'CARD', id }));
  const transforms = ['name', 'description', 'attack', 'hp'].reduce((acc, name) => {
    const transformName = name + 'Transform';
    return { ...acc, [transformName]: props.data[transformName] }
  }, {});

  const card = mergeCards(props.data, ...models);

  return {
    data: {
      ...card,
      thumbnail: getResourceById(state, card.thumbnail),
      background: getResourceById(state, card.background),
      effects: getEffectsByIds(state, card.effects),
    },
    cardSize: state.deck.cardSize,
  }
};

export default connect(mapStateToProps)(Card);
