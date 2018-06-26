import React, { Component } from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { faPalette, faSlidersH, faCheck } from '@fortawesome/fontawesome-free-solid';
import Modal from 'react-modal';
import Toggle from 'react-toggle';

Modal.setAppElement('#root');

class ThemeSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTheme: this.props.theme,
      toggledTheme: this.props.theme,
      particles: {
        on: true,
        clickable: true,
        connected: true
      },
      showToolTip: false
    }

    this.themeColors = [
      "Ultraviolet",
      "Dream On, Neon!",
      "Tequila Sunrise",
      "Miss Mango",
      "Macintosh",
      "Seattle",
      "Slate"
    ]
  }

  toggleThemeName = (e) => {
    let toggledTheme = e.target.value ? e.target.value.split(':') : this.state.toggledTheme;

    if (e.type === 'mouseenter') {
      this.setState({ toggledTheme });
    } else {
      this.setState({ toggledTheme: this.state.currentTheme });
    }
  }

  setTheme = (e) => {
    e.preventDefault();
    let currentTheme = e.target.value ? e.target.value.split(':') : this.state.currentTheme;
    let toggledTheme = currentTheme;

    this.setState({ currentTheme, toggledTheme }, () => {
      this.props.setTheme(this.state.currentTheme);
    });
  }

  setParticleOption = (e) => {
    let key = e.target.value;
    let checked = e.target.checked;

    this.setState((prevState) => {
      let particles = prevState.particles;
      particles[key] = checked;

      return { particles };
    }, () => {
      this.props.setParticles(this.state.particles);
    });
  }

  toolTip = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({ showToolTip: !prevState.showToolTip }));
  }

  parseThemeName = (theme) => theme.replace(/,|!/g, '').replace(/ /g, '-').toLowerCase();

  render() {
    let showToolTip = this.state.showToolTip ? "tip show-tip" : "tip";

    return (
      <Modal
      className={`modal ${this.props.modalIs}`}
      overlayClassName={`overlay ${this.props.modalIs}`}
      isOpen={this.props.showModal}>
        <div className="close-modal" onClick={this.props.closeModal}></div>
        <div className="theme-colors">
          <h3><FontAwesome icon={faPalette} />Theme Color:<span className="theme-name">{this.state.toggledTheme[1]}</span></h3>

          {this.themeColors.map((theme, i) => {
            let themeClass = this.parseThemeName(theme);

            if (theme === 'Dream On, Neon!' ||
                theme === 'Tequila Sunrise' ||
                theme === 'Miss Mango' ||
                theme === 'Seattle') {
                themeClass += '-bright';
            }

            return <button value={`${themeClass}:${theme}`}
              className={`color ${themeClass}`}
              onMouseEnter={this.toggleThemeName}
              onMouseLeave={this.toggleThemeName}
              onClick={this.setTheme}
              key={i}>
              {theme === this.state.currentTheme[1] ? <FontAwesome icon={faCheck} /> : ''}
            </button>
          })}
        </div>

        <div className="particle-options">
          <h3><FontAwesome icon={faSlidersH} />Particles:</h3>

          <label>
            <Toggle
              checked={this.state.particles.on}
              onChange={this.setParticleOption}
              value={'on'}
              icons={false} />
            <span>On</span>
          </label>

          <label>
            <Toggle
              checked={this.state.particles.clickable}
              onChange={this.setParticleOption}
              value={'clickable'}
              icons={false} />
            <span>Clickable</span>
          </label>

          <label>
            <Toggle
              checked={this.state.particles.connected}
              onChange={this.setParticleOption}
              value={'connected'}
              icons={false} />
            <span className={showToolTip}>Only for desktop users</span>
            <span className="tool-tip" onClick={this.toolTip}>Connected</span>
          </label>
        </div>
      </Modal>
    );
  }
}

export default ThemeSettings;
