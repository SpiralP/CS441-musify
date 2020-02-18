import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import mysql from "mysql";
import cors from "cors";
const Xapi = require("xmysql/lib/xapi.js");
const cmdargs = require("xmysql/lib/util/cmd.helper.js");

const ADDRESS = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

interface Config {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  readOnly: boolean;
}

const sqlConfig: Config = {
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
  app.use(morgan("tiny"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(express.static("../dist"));

  const mysqlPool = mysql.createPool(sqlConfig);
  console.log("Generating REST APIs");

  const moreApis = new Xapi(sqlConfig, mysqlPool, app);

  moreApis.init((err: any, results: any) => {
    if (err) {
      throw new Error(err);
    }

    console.log(`listening on http://${ADDRESS}:${PORT}/`);
    app.listen(PORT, ADDRESS);
  });
}

start();
