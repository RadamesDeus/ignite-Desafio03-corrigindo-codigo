const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksRepositorieExists(request, response, next) {
  const { id } = request.params;

  // if (!validate(id)) {
  //   return response.status(400).json({ error: "id not valid" });
  // }

  let repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksRepositorieExists, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  delete updatedRepository.likes;
  request.repository = { ...repository, ...updatedRepository };

  return response.send(request.repository);
});

app.delete(
  "/repositories/:id",
  checksRepositorieExists,
  (request, response) => {
    const { repository } = request;

    let repositoryIndex = repositories.indexOf(repository);

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  }
);

app.post(
  "/repositories/:id/like",
  checksRepositorieExists,
  (request, response) => {
    const { repository } = request;

    repository.likes += 1;
    return response.json(repository);
  }
);

module.exports = app;
