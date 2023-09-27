const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT ?? 3000;
const db = require('./queries')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
  
app.use(express.static('public'))

app.get('/events/:page/:idCategory', async (req, res) => {
    await db.getEvent(req, res);
  });

app.get('/events/:id', async (req, res) => {
await db.getEvent(req, res);
});

app.get('/categories', db.getCategories);

// app.get('*', (req, res) => {
//     res.redirect('/');
// })

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})