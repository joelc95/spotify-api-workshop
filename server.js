import fetch from "node-fetch";
import express from "express";

const spotify_client_id = `${process.env.SPOTIFY_CLIENT_ID}`
const spotify_client_secret = `${process.env.SPOTIFY_CLIENT_SECRET}`;
const spotify_redirect_uri = "http://localhost:3000/callback";

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
    scope: "",
    redirect_uri: spotify_redirect_uri
  })

  res.redirect('https://accounts.spotify.com/authorize?' + auth_query_parameters.toString());
});

app.get("/callback", (req, res) => {
  const code = req.query.code;
  
  var body
});

let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});
