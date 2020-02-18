import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "core-js/stable";
import "regenerator-runtime/runtime";

// gross fix for winston in browser
// https://github.com/winstonjs/winston/issues/1354#issuecomment-426433071
import "setimmediate";

// // import css files
// import "normalize.css/normalize.css";
// // <!-- blueprint-icons.css file must be included alongside blueprint.css! -->
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// import "@blueprintjs/core/lib/css/blueprint.css";

ReactDOM.render(<App />, document.querySelector("#container"));
