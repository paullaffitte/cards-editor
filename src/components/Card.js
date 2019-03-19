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
    let transform = this.props[`${name}Transform`];
    transform = transform ? transform : {};

    return (
      <div className={name + ' positionable'} style={{
        left: userToPercent(transform.x),
        top: userToPercent(transform.y),
        fontSize: userToPt(transform.scale)
      }}>
        {customValue ? customValue : this.props[name]}
      </div>
    );
  };

  render() {
    const effects = this.props.effects.map(({ description }) => description).filter(Boolean).join('. ');
    let size = this.state.sizes.background;

    return (
      <div className="Card" style={{ ...this.props.style, width: size.width, height: size.height, transform: `scale(${this.state.scale})` }}>
        <img className="thumbnail positionable" src={ this.props.thumbnail } onLoad={ this.updateImage("thumbnail") } style={ this.getThumbnailStyle() } />
        <img className="background" src={ this.props.background } onLoad={ this.updateImage("background") } />
        {this.renderText('name')}
        {this.renderText('description', [effects, effects ? '.\n' : '', this.props.description])}
        {this.props.type !== 'minion' ? null : (
          <div>
            {this.renderText('hp')}
            {this.renderText('attack')}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const cardConfig = getCardsConfig(state);
  const transforms = ['name', 'description', 'attack', 'hp'].reduce((acc, name) => {
    const transformName = name + 'Transform';
    const cardTransform = props[transformName] ? props[transformName] : {};
    const configTransform = cardConfig[transformName] ? cardConfig[transformName] : {};

    return { ...acc, [transformName]: {
      x: cardTransform.x ? cardTransform.x : configTransform.x,
      y: cardTransform.y ? cardTransform.y : configTransform.y,
      scale: cardTransform.scale ? cardTransform.scale : configTransform.scale,
    }}
  }, {});

  return {
    thumbnail: getResourceByName(state, props.thumbnail),
    background: getResourceByName(state, props.background),
    effects: getEffectsByIds(state, props.effects),
    ...transforms
  }
};

export default connect(mapStateToProps)(Card);
