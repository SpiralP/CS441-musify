import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import mysql from "mysql";
import Xapi from "xmysql/lib/xapi.js";
import cmdargs from "xmysql/lib/util/cmd.helper.js";
import express_enforces_ssl from "express-enforces-ssl";

const ADDRESS = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const sqlConfig = {
  host: "csusm.c0uo1rgt9ctn.us-west-2.rds.amazonaws.com",
  user: "cs441",
  password: "csusmcs441",
  port: 3306,
  database: "musify",
  readOnly: true,
};

cmdargs.handle(sqlConfig);

async function start() {
  const app = express();

  if (process.env.PORT) {
    // we're running on heroku

    // sets req.protocol to the proxy's protocol
    app.enable("trust proxy");

    // redirect to https if coming from http
    app.use(express_enforces_ssl());
  }

  app.use(morgan("common"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(express.static("../client/build"));

  console.log("Generating REST APIs");
  const mysqlPool = mysql.createPool(sqlConfig);
  const moreApis = new Xapi(sqlConfig, mysqlPool, app);

  moreApis.init((err, results) => {
    if (err) {
      throw new Error(err);
    }

    console.log(`listening on http://localhost:${PORT}/`);
    app.listen(PORT, ADDRESS);
  });
}

start();
