const mongoose = require("mongoose");

// Schema
const todoSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const noteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  todoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",
  },
  text_description: String,
});

// Model
const Todo = mongoose.model("Todo", todoSchema);
const Note = mongoose.model("Note", noteSchema);

// Export
module.exports = { Todo, Note };
