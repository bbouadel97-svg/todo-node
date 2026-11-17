const pool = require("../db");

async function getAllTasks() {
  const [rows] = await pool.execute(
    "SELECT id, title, completed FROM tasks ORDER BY id"
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    done: Boolean(row.completed),
  }));
}

async function getTaskById(id) {
  const [rows] = await pool.execute(
    "SELECT id, title, completed FROM tasks WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return undefined;
  }

  return {
    id: rows[0].id,
    title: rows[0].title,
    done: Boolean(rows[0].completed),
  };
}

async function createTask(title, completed) {
  const [result] = await pool.execute(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed ? 1 : 0]
  );

  return getTaskById(result.insertId);
}

async function updateTask(id, title, done) {
  const [result] = await pool.execute(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
    [title, done ? 1 : 0, id]
  );

  if (result.affectedRows === 0) {
    return undefined;
  }

  return getTaskById(id);
}

async function deleteTask(id) {
  const [result] = await pool.execute(
    "DELETE FROM tasks WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

async function patchTask(id, done) {
  const [result] = await pool.execute(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [done ? 1 : 0, id]
  );

  if (result.affectedRows === 0) {
    return undefined;
  }

  return getTaskById(id);
}
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  patchTask,
};