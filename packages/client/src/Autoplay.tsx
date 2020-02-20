import React from "react";

interface AutoplayState {
  pressed: boolean;
}

export default class Autoplay extends React.PureComponent<{}, AutoplayState> {
  state: AutoplayState = { pressed: false };

  render() {
    const { pressed } = this.state;
    const { children } = this.props;

    if (pressed) {
      return children;
    } else {
      // force the user to click on the page so that autoplaying works!
      return (
        <button onClick={() => this.setState({ pressed: true })}>
          Press to play audio!
        </button>
      );
    }
  }
}
