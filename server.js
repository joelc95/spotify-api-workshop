import fetch from "node-fetch";
import express from "express";

const spotify_client_id = "b32001087f804ee7a69d045e5a1ca07c";
const spotify_client_secret = "1c13e2cfa9df4030a0e4670257bb115a";
const spotify_redirect_uri = "http://localhost:3000/callback";

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

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
  console.log(code);
});

let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});
