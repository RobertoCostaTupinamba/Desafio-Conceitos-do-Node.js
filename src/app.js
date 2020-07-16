const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(202).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({ error: "Invalid body params" });
  }
  
  const project = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(project);

  response.status(202).json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid id" });
  }

  const projectIndex = repositories.findIndex(repository => repository.id == id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: "Not found id"})
  }

  const project = { ...repositories[projectIndex], title, url, techs}

  repositories[projectIndex] = project;

  return response.status(202).json(project)
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: "Invalid id"})
  }

  const projectIndex = repositories.findIndex(repository => repository.id == id);

  if (projectIndex < 0 ){
    return response.status(400).json({error: "Not found"})
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid id" })
  }

  const projectIndex = repositories.findIndex(repository => repository.id == id);

  if (projectIndex < 0 ){
    return response.status(400).json({error: "Not found"})
  }

  const { likes } = repositories[projectIndex]

  const project = {...repositories[projectIndex], likes:likes+1}

  repositories[projectIndex] = project

  return response.status(202).json(project)
  
});

module.exports = app;
