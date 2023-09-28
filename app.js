const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT ?? 3000;
const db = require("./src/queries");
const API = require("./src/auth");
const encryption = require("./src/encryption.js");

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

app.post("/encrypt", (req, res) => {
  try {
    const { data } = req.body;
    console.log("🚀 ~ file: app.js:32 ~ app.post ~ data:", data);
    const encryptedData = encryption.encryptData(data);
    res.json({ encryptedData });
  } catch (error) {
    console.log("🚀 ~ file: app.js:37 ~ app.post ~ error:", error);
    res.status(500).end();
  }
});

app.post("/decrypt", (req, res) => {
  try {
    const { encryptedData } = req.body;
    const data = encryption.decryptData(encryptedData);
    res.json({ data });
  } catch (error) {
    console.log("🚀 ~ file: app.js:41 ~ app.post ~ error:", error);
    res.status(500).end();
  }
});

// app.get('*', (req, res) => {
//     res.redirect('/');
// })

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
