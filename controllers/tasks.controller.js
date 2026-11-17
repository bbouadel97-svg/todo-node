const { signalerChangementTaches } = require("../tempsReel");
const repo = require("../repositories/tasks.repository");
require("../db");

async function listTasks(req, res) {
  try {
    let tasks = await repo.getAllTasks();
    const { done } = req.query;

    if (done !== undefined) {
      if (done !== "true" && done !== "false") {
        return res.status(400).json({ error: "done doit être true ou false" });
      }

      tasks = tasks.filter((task) => task.done === (done === "true"));
    }

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de lecture" });
  }
}

async function getTask(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const task = await repo.getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de lecture" });
  }
}

async function createTask(req, res) {
  try {
    const { title, completed = false } = req.body ?? {};

    if (
      typeof title !== "string" ||
      title.trim().length < 2 ||
      title.length > 120
    ) {
      return res.status(400).json({ error: "Titre invalide" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed doit être un booléen" });
    }

    const task = await repo.createTask(title.trim(), completed);
    res.status(201).json(task);
    signalerChangementTaches();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur d'écriture" });
  }
}

async function updateTask(req, res) {
  const id = Number(req.params.id);
  const { title, done } = req.body ?? {};

  if (
    !Number.isInteger(id) ||
    id < 1 ||
    typeof title !== "string" ||
    title.trim().length < 2 ||
    title.length > 120 ||
    typeof done !== "boolean"
  ) {
    return res.status(400).json({ error: "Données invalides" });
  }

  try {
    const task = await repo.updateTask(id, title.trim(), done);

    if (!task) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }

    res.json(task);
    signalerChangementTaches();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de sauvegarde" });
  }
}

async function patchTask(req, res) {
  const id = Number(req.params.id);
  const { done } = req.body || {};
  if (!Number.isInteger(id) || id < 1 || typeof done !== "boolean") {
    return res.status(400).json({ error: "done doit être booléen" });
  }
  try {
    const task = await repo.patchTask(id, done);
    if (!task) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }
    res.json(task);
    signalerChangementTaches();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de sauvegarde" });
  }
}
async function deleteTask(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const deleted = await repo.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }

    res.status(204).send();
    signalerChangementTaches();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de sauvegarde" });
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
};
