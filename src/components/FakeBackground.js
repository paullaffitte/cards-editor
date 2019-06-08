import React, { Component } from 'react';

class Container extends Component {

  onClick = () => this.props.onClick ? this.props.onClick() : null;

  render() {
    return (
      <div
        className={ this.props.className }
        style={{ ...this.props.style, position: 'relative', width: '100%', height: '100%' }}
        onClick={ this.onClick }>
        { this.props.children }
      </div>
    );
  }
}

class FakeBackground extends Component {

  render() {
    return this.props.src ? (
      <Container className={ this.props.className } style={ this.props.style } onClick={ this.props.onClick }>
        <div style={{ overflow: 'hidden', position: 'absolute' }}>
          { this.props.src ? (<img src={ this.props.src } alt="" />) : null }
        </div>
        <div className="full-size" style={{ position: 'absolute' }}>
          { this.props.children }
        </div>
      </Container>
    ) : (
      <Container className={ this.props.className } style={ this.props.style } onClick={ this.props.onClick }>
        { this.props.children }
      </Container>
    );
  }
}

export default FakeBackground;
