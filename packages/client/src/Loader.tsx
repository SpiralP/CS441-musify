import React from "react";

interface LoaderProps<T, U> {
  promise: (update: (value: U | null) => void) => Promise<T>;
  renderLoading: (value: U | null) => React.ReactNode;
  renderSuccess: (value: T) => React.ReactNode;
  renderError: (value: Error) => React.ReactNode;
}

interface LoaderState<T, U> {
  currentState:
    | { type: "loading"; value: U | null }
    | { type: "error"; error: Error }
    | { type: "success"; value: T };
}

export default class Loader<T, U> extends React.PureComponent<
  LoaderProps<T, U>,
  LoaderState<T, U>
> {
  state: LoaderState<T, U> = {
    currentState: {
      type: "loading",
      value: null,
    },
  };

  componentDidMount() {
    const { promise } = this.props;

    const updateCallback = (value: U | null) => {
      this.setState({
        currentState: {
          type: "loading",
          value,
        },
      });
    };

    promise(updateCallback)
      .then((value) => {
        this.setState({
          currentState: {
            type: "success",
            value,
          },
        });
      })
      .catch((error) => {
        this.setState({
          currentState: {
            type: "error",
            error,
          },
        });
      });
  }

  render() {
    const { currentState } = this.state;

    if (currentState.type === "success") {
      return this.props.renderSuccess(currentState.value);
    } else if (currentState.type === "loading") {
      return this.props.renderLoading(currentState.value);
    } else if (currentState.type === "error") {
      return this.props.renderError(currentState.error);
    }
  }
}
