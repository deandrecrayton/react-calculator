import React, { Component } from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import { faCog } from '@fortawesome/fontawesome-free-solid';
import Calculator from './components/Calculator';
import ThemeSettings from './components/ThemeSettings.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: ['ultraviolet', 'Ultraviolet'],
      showModal: false,
      modalIs: 'closed'
    }

    document.getElementsByTagName('body')[0].classList.add(this.state.theme[0]);
  }

  setAnswer = (answer) => {
    this.setState({ answer });
  }

  sendToLog = (equation) => {
    this.setState((prevState) => ({
      log: [...prevState.log, equation]
    }));
  }

  setTheme = (theme) => {
    document.getElementsByTagName('body')[0].classList.replace(this.state.theme[0], theme[0]);

    this.setState({ theme }, () => {
      if (this.state.theme[0].includes('bright')) {
        this.props.setParticleOpacity([1.6, 0.6]);
      } else if (this.state.theme[0].includes('macintosh')) {
        this.props.setParticleOpacity([1, 0.3]);
      } else if (this.state.theme[0].includes('dream-on-neon')) {
        this.props.setParticleOpacity([1, 0.9]);
      } else {
        this.props.setParticleOpacity([0.8, 0.2]);
      }
    });
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState({
      showModal: true,
      modalIs: 'closed'
    }, () => {
      setTimeout(() => { this.setState({ modalIs: 'open' }) }, 100);
    });
  }

  closeModal = (e) => {
    e.preventDefault();
    this.setState({ modalIs: 'closed' }, () => {
      setTimeout(() => { this.setState({ showModal: false }) }, 300);
    });
  }

  reFocus = (e) => {
    document.getElementById('keyboard-input').focus({ preventScroll: true });
  }

  render() {
    return (
      <div className="app">
        <header onClick={this.reFocus}>
          <button className="theme-settings" onClick={this.openModal}><FontAwesome icon={faCog} /></button>
          <h1>React.js Calculator</h1>
          <a href="https://github.com/deanmontez/react-calculator" target="blank" className="github"><FontAwesome icon={faGithub} /></a>
        </header>
  
        <Calculator />

        <ThemeSettings
          theme={this.state.theme}
          setTheme={this.setTheme}
          setParticles={this.props.setParticles}
          showModal={this.state.showModal}
          closeModal={this.closeModal}
          modalIs={this.state.modalIs} />
      </div>
    );
  }
}
export default App;
