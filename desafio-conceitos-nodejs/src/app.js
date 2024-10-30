const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isValidId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
      return res.status(400).json({ error: 'Invalid project ID.'});
  }

  return next();
}

app.use('/repositories/:id', isValidId);

app.get("/repositories", (req, res) => {

  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return res.json(repositorie);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  let numLikes = 0;

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if(repIndex < 0) {
      return res.status(400).json({ error: 'Repositorie not found.' });
  }

  numLikes = repositories[repIndex].likes;

  const repositorie = { id, title, url, techs, likes: numLikes };

  repositories[repIndex] = repositorie;

  return res.json(repositorie);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if(repIndex < 0) {
      return res.status(400).json({ error: 'Project not found.' });
  }

  repositories.splice(repIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const rep = repositories.find(rep => rep.id === id);

  if(!rep) {
      return res.status(400).json({ error: 'Project not found.' });
  }

  rep.likes++;

  return res.json(rep);
});

module.exports = app;
