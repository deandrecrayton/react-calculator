import React from "react";
import Toggle from "react-toggle";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      degrees: false,
      ln: false,
      showToolTip: false
    }
  }

  toggleDegrees = (e) => {
    this.setState((prevState) => (
      { degrees: !prevState.degrees }
    ), () => {
      this.props.setTrigUnit(this.state.degrees);
    });
  }

  toggleLn = (e) => {
    this.setState((prevState) => (
      { ln: !prevState.ln }
    ), () => {
      this.props.setLog(this.state.ln);
    });
  }

  toolTip = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({ showToolTip: !prevState.showToolTip }));
  }

  render() {
    let showToolTip = this.state.showToolTip ? "tip show-tip" : "tip";

    return (
      <form className="settings">
        <label>
          <Toggle
            checked={this.state.degrees}
            onChange={this.toggleDegrees}
            icons={false}
            disabled
            aria-label="Degrees" />
          <span className={showToolTip}>Feature coming soon!</span>
          <span><span className="coming-soon" onClick={this.toolTip}>Deg</span></span>
        </label>

        <label>
          <Toggle
            checked={this.state.ln}
            onChange={this.toggleLn}
            icons={false}
            aria-label="Natural Log" />
          <span>ln</span>
        </label>

        <button>MC</button>
      </form>
    );
  }
}

export default Settings;
