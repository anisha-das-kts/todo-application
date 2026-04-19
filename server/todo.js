const mongoose = require("mongoose");

// Schema
const todoSchema = new mongoose.Schema({
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
