const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT ?? 3000;
const db = require("./src/queries");
const API = require("./src/auth");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.get("/events/detail/:id", API.authenticateKey, async (req, res) => {
  await db.getEvent(req, res);
});

app.get("/events/:page/:idCategory", API.authenticateKey, async (req, res) => {
  await db.getEvents(req, res);
});

app.get("/categories", API.authenticateKey, async (req, res) => {
  await db.getCategories(req, res);
});

// app.get('*', (req, res) => {
//     res.redirect('/');
// })

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
