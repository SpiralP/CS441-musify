import React from "react";

interface LoaderProps<T> {
  promise: () => Promise<T>;
  renderLoading: React.ReactNode;
  renderSuccess: (value: T) => React.ReactNode;
  renderError: (value: Error) => React.ReactNode;
}

interface LoaderState<T> {
  currentState:
    | { type: "loading" }
    | { type: "error"; error: Error }
    | { type: "success"; value: T };
}

export default class Loader<T> extends React.PureComponent<
  LoaderProps<T>,
  LoaderState<T>
> {
  state: LoaderState<T> = {
    currentState: {
      type: "loading",
    },
  };

  componentDidMount() {
    const { promise } = this.props;

    promise()
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
      return this.props.renderLoading;
    } else if (currentState.type === "error") {
      return this.props.renderError(currentState.error);
    }
  }
}
