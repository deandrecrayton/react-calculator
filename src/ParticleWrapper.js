import React, { Component } from 'react';
import App from './App';
import Particles from 'react-particles-js';
import particleConfig from './particle-config';

class ParticleWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayParticles: true,
      particleConfig
    }
  }

  setParticles = (config) => {
    particleConfig.interactivity.events.onhover.enable = config.connected;
    particleConfig.interactivity.events.onclick.enable = config.clickable;

    this.setState({
      displayParticles: config.on,
      particleConfig
    });
  }

  setParticleOpacity = (val) => {
    particleConfig.particles.opacity.value = val[0];
    particleConfig.interactivity.modes.grab.line_linked.opacity = val[1];

    this.setState({ particleConfig });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.displayParticles ? <Particles params={this.state.particleConfig} /> : null}
        <App setParticles={this.setParticles} setParticleOpacity={this.setParticleOpacity} />
      </React.Fragment>
    );
  }
}

export default ParticleWrapper;