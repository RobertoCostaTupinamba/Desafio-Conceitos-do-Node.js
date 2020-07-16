const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid id" });
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Not found" });
  }

  request.params = { ...request.params, repositoryIndex };

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(202).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({ error: "Invalid body params" });
  }

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  response.status(202).json(repository);
});

app.put("/repositories/:id", verifyID, (request, response) => {
  const { repositoryIndex } = request.params;
  const { title, url, techs } = request.body;

  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.status(202).json(repository);
});

app.delete("/repositories/:id", verifyID, (request, response) => {
  const { repositoryIndex } = request.params;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyID, (request, response) => {
  const { repositoryIndex } = request.params;

  const { likes } = repositories[repositoryIndex];

  const repository = { ...repositories[repositoryIndex], likes: likes + 1 };

  repositories[repositoryIndex] = repository;

  return response.status(202).json(repository);
});

module.exports = app;
