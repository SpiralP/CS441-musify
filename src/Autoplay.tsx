import React from "react";
import { Button, Intent } from "@blueprintjs/core";

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
        <>
          <br />
          <Button
            onClick={() => this.setState({ pressed: true })}
            intent={Intent.PRIMARY}
            large
          >
            Press to play audio!
          </Button>
        </>
      );
    }
  }
}
