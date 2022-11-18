import fetch from "node-fetch";
import express from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require("dotenv").config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
// const spotify_client_id = 'b32001087f804ee7a69d045e5a1ca07c'
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// const spotify_client_secret = '8beea0d73dba41c7ab9544df96011799'
const spotify_redirect_uri = "http://localhost:3000/callback";

global.access_token;

// This is all boilerplate using express functions to set up the server

// Here we trigger the express instance
const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

// This tells express where the static page files are for our app
app.use(express.static("public"));

// Here we set up our endpoints...
// A GET request to our root (homepage) trigger a callback function that
// renders the HTML in the PUG file
app.get("/", function (request, response) {
  response.render("index");
});

app.get("/authorize", (req, res) => {
  // http://api.spotify.com/endpoint?key=val&key=val...
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: "user-library-read",
    redirect_uri: spotify_redirect_uri
  })
  console.log("client ID is " + process.env.SPOTIFY_CLIENT_ID)
  console.log(spotify_client_id)
  console.log(auth_query_parameters)
  res.redirect('https://accounts.spotify.com/authorize?' + auth_query_parameters.toString());
});

app.get("/callback", async(req, res) => {
  const code = req.query.code;
  
  var body = new URLSearchParams({
    code: code,
    redirect_uri: spotify_redirect_uri,
    grant_type: "authorization_code"
  })

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
      "Basic " + Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64")
    }
  })

  const data = await response.json();
  global.access_token = data.access_token;

  res.redirect("/dashboard");
  
});

const getData = async (endpoint) => {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "get",
    headers: {
      Authorization: "Bearer " + global.access_token
    }
  })

  const data = await response.json();
  return data;
}



app.get("/dashboard", async(req,res) => {
  const userInfo = await getData("/me");
  const tracks = await getData("/me/tracks?limit=10");
  res.render("dashboard", { user: userInfo, tracks: tracks.items });
  console.log(tracks)
})

app.get("/recommendations", async(req,res) => {
  const artist_id = req.query.artist;
  const track_id = req.query.track;

  const params = new URLSearchParams({
    seed_artist: artist_id,
    seed_genres: "rock",
    seed_tracks: track_id
  })

  const data = await getData('/recommendation?' + params);
  res.render("recommendation");
})

let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});
