import axios from "axios";
import qs from "qs";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import mysql from "mysql";
import querystring from "querystring";
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
  app.use(morgan("combined"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(express.static("../dist"));

  const CLIENT_ID = "ebacb6791c014ba7890d3694545e66f9";
  const CLIENT_SECRET = "50fd18b26f5246298e3939767e3f4008";

  const scopes = "user-read-private user-read-email";

  // app.get("/login", function(req, res) {
  //   const redirect_uri = req.protocol + "://" + req.get("host") + "/callback";
  //   console.log(
  //     `redirecting client to spotify's authorize page, redirect_uri = ${redirect_uri}`
  //   );

  //   res.redirect(
  //     "https://accounts.spotify.com/authorize?" +
  //       qs.stringify({
  //         response_type: "code",
  //         client_id: CLIENT_ID,
  //         scopes,
  //         redirect_uri,
  //       })
  //   );
  // });

  // pass access_token from authorization code handoff straight to client :JOY:
  app.get("/callback", function(req, res, next) {
    const redirect_uri = req.protocol + "://" + req.get("host") + "/callback";

    const error = req.query.error;
    if (error != null) {
      res.send("Spotify returned error: " + error);
    } else {
      const code = req.query.code;
      if (!code) {
        throw new Error("received no code or error in query parameters");
      } else {
        axios({
          method: "POST",
          url: "https://accounts.spotify.com/api/token",
          data: qs.stringify({
            grant_type: "authorization_code",
            code,
            redirect_uri,
          }),
          auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
          },
        })
          .then((response) => {
            console.log(response.data);

            res.redirect(
              "/?" +
                qs.stringify({
                  token: response.data.access_token,
                })
            );
          })
          .catch(next);
      }
    }
  });

  console.log("Generating REST APIs");
  const mysqlPool = mysql.createPool(sqlConfig);
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
