import React from "react";

interface LoaderProps<PROMISE_TYPE, UPDATE_TYPE> {
  promise: (
    update: (value: UPDATE_TYPE | null) => void
  ) => Promise<PROMISE_TYPE>;
  renderLoading: (value: UPDATE_TYPE | null) => React.ReactNode;
  renderSuccess: (value: PROMISE_TYPE) => React.ReactNode;
  renderError: (value: Error) => React.ReactNode;
}

interface LoaderState<PROMISE_TYPE, UPDATE_TYPE> {
  currentState:
    | { type: "loading"; value: UPDATE_TYPE | null }
    | { type: "error"; error: Error }
    | { type: "success"; value: PROMISE_TYPE };
}

export default class Loader<
  PROMISE_TYPE,
  UPDATE_TYPE
> extends React.PureComponent<
  LoaderProps<PROMISE_TYPE, UPDATE_TYPE>,
  LoaderState<PROMISE_TYPE, UPDATE_TYPE>
> {
  state: LoaderState<PROMISE_TYPE, UPDATE_TYPE> = {
    currentState: {
      type: "loading",
      value: null,
    },
  };

  componentDidMount() {
    const { promise } = this.props;

    const updateCallback = (value: UPDATE_TYPE | null) => {
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
