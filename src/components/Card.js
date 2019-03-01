import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResourceByName } from '../state/selectors/deck';

class Card extends Component {

  state = {
    width: 100,
    height: 100
  }

  async componentDidMount() {
    const refs = [this.refs.thumbnail, this.refs.background];

    refs.forEach(ref => {
      ref.onload = () => {
        if (refs.every(ref => ref.complete))
          this.renderCanvas();
      }
    });
  }

  async renderCanvas() {
    const canvas = this.refs.canvas;
    const [ thumbnail, background ] = await Promise.all([ this.refs.thumbnail, this.refs.background ]);
    const { width, height } = background;
    const ctx = canvas.getContext("2d");

    if (this.state.width !== width || this.state.height !== height)
      this.setState({ width, height });

    ctx.drawImage(thumbnail, background.width / 2 - thumbnail.width / 2, 0);
    ctx.drawImage(background, 0, 0);
  }

  render() {
    return (
      <div className="card">
        <h3>{this.props.name}</h3>
        <div>{this.props.description}</div>
        <div>HP: {this.props.hp}</div>
        <div>Attack: {this.props.attack}</div>

        <canvas ref="canvas" width={this.state.width} height={this.state.height} />
        <img ref="thumbnail" src={this.props.thumbnail} className="hidden" alt="canvas_source" />
        <img ref="background" src={this.props.background} className="hidden" alt="canvas_source" />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  thumbnail: getResourceByName(state, props.thumbnail),
  background: getResourceByName(state, props.background)
});

export default connect(mapStateToProps)(Card);
