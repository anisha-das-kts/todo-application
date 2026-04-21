const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Todo, Note } = require("./todo");
const port = 3000;
// const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.set("etag", false);
// app.use(bodyParser.json());

// let todos = [];

// Connect DB
mongoose
  .connect(
    "mongodb://anishadaskts2001_db_user:gwJvPXJeg_A3Ks3@ac-mdo5lid-shard-00-00.r0r18ka.mongodb.net:27017,ac-mdo5lid-shard-00-01.r0r18ka.mongodb.net:27017,ac-mdo5lid-shard-00-02.r0r18ka.mongodb.net:27017/?ssl=true&replicaSet=atlas-ka4rpu-shard-0&authSource=admin&appName=Cluster0",
  )
  .then(() => console.log("Connected to MongoDB Atlas..."))
  .catch((err) => console.log("DB Error:", err.message));

// Get All API
app.get("/todos", async (req, res) => {
  // res.send("Get all todos");
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // res.json(todos);
});

// Get By ID API
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!!" });
    }
    res.json(todo);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// Get API Aggregate
app.get("/todos-with-notes", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const result = await Todo.aggregate([
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "todoId",
          as: "notes",
        },
      },
      {
        $addFields: {
          notes: { $ifNull: ["$notes", []] },
        },
      },
    ]);

    const totalCount = await Todo.countDocuments();

    const hasMore = skip + result.length < totalCount;

    res.json({
      data: result,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});

// Post API or Create Todo API
app.post("/todos", async (req, res) => {
  try {
    const text = req.body?.text;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text is Required." });
    }

    const newTodo = await Todo.create({ text });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Create Note API
app.post("/notes", async (req, res) => {
  try {
    const { todoId, text_description } = req.body;

    if (!todoId || !text_description) {
      return res.status(400).json({ message: "All fields required." });
    }

    const newNote = await Note.create({ todoId, text_description });

    res.json(newNote);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Put API or Update API
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// Delete API
app.delete("/todos/:id", async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully!!" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
