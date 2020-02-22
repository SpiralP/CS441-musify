import axios from "axios";
import qs from "qs";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import mysql from "mysql";
import Xapi from "xmysql/lib/xapi.js";
import cmdargs from "xmysql/lib/util/cmd.helper.js";
import express_enforces_ssl from "express-enforces-ssl";

const CLIENT_ID = "ebacb6791c014ba7890d3694545e66f9";
const CLIENT_SECRET = "50fd18b26f5246298e3939767e3f4008";

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
            const { access_token, expires_in } = response.data;

            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + expires_in - 10);

            res.cookie("spotifyAccessToken", access_token, {
              expires,
            });

            res.redirect("/");
          })
          .catch((err) => {
            next(err);
          });
      }
    }
  });

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
