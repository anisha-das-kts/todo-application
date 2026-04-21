import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)
  const [todos, setTodos] = useState([]);
  const [noteInput, setNoteInput] = useState({});
  const [skip, setSkip] = useState(0);
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [input, setInput] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const loaderRef = useRef();
  const skipRef = useRef(0);
  const fetchingRef = useRef(false);
  const initialFetchDone = useRef(false);

  // useEffect(() => {
  //   fetch("http://localhost:3000/todos-with-notes")
  //     .then((res) => res.json())
  //     .then((data) => setTodos(data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    const fetchInitial = async () => {
      const res = await fetch(
        `http://localhost:3000/todos-with-notes?limit=${limit}&skip=0`,
      );

      const data = await res.json();

      setTodos(data.data);

      skipRef.current = limit;
      setSkip(limit);

      setHasMore(data.hasMore);

      setInitialLoading(false);
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && !fetchingRef.current && hasMore) {
          loadMoreTodos();
        }
      },
      { threshold: 1 },
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [initialLoading, hasMore]);

  const loadMoreTodos = async () => {
    if (fetchingRef.current || !hasMore) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/todos-with-notes?limit=${limit}&skip=${skipRef.current}`,
      );

      const data = await res.json();
      const todosFromAPI = data?.data || [];

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setTodos((prev) => {
        const ids = new Set(prev.map((t) => String(t._id)));
        const newItems = todosFromAPI.filter((t) => !ids.has(String(t._id)));
        return [...prev, ...newItems];
      });

      skipRef.current += limit;
      setSkip(skipRef.current);

      setHasMore(data.hasMore);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    fetchingRef.current = false;
  };

  const addTodos = async () => {
    if (input.trim() === "") return;

    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input }),
    });

    const newTodo = await res.json();

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const addNote = async (todoId) => {
    const text = noteInput[todoId];

    if (!text) return;

    await fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todoId,
        text_description: text,
      }),
    });

    // refresh data
    const res = await fetch(
      `http://localhost:3000/todos-with-notes?limit=${limit}&skip=0`,
    );
    const data = await res.json();
    setTodos(data.data);
    setSkip(limit);

    // clear input
    setNoteInput({ ...noteInput, [todoId]: "" });
  };

  const deleteTodos = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const toggleTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
    });

    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Todo Application</h1>

      <div className="todo-container">
        <div className="input-section" style={{ marginTop: "50px" }}>
          <input
            type="text"
            value={input}
            placeholder="Enter Your Task"
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={addTodos}>Add</button>
        </div>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <div>
              {/* TODO TEXT */}
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  fontWeight: "bold",
                  fontSize: "25px",
                }}
              >
                {todo.text}
              </span>

              {/* NOTES */}
              <ul>
                {Array.isArray(todo.notes) && todo.notes.length > 0 ? (
                  todo.notes.map((note) => (
                    <li key={note._id}>• {note.text_description}</li>
                  ))
                ) : (
                  <li style={{ color: "gray", fontSize: "12px" }}>
                    No notes added yet.
                  </li>
                )}
              </ul>
            </div>
            <div
              className="btn-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              {/* ADD NOTE INPUT */}
              <div className="input-section">
                <input
                  type="text"
                  placeholder="Add Your Note"
                  value={noteInput[todo._id] || ""}
                  onChange={(e) =>
                    setNoteInput({
                      ...noteInput,
                      [todo._id]: e.target.value,
                    })
                  }
                />
                {/* BUTTONS */}
                <button onClick={() => addNote(todo._id)}>Add Note</button>
              </div>
              <button onClick={() => toggleTodo(todo._id)}>
                {todo.completed ? "Undo" : "Mark as Completed"}
              </button>
              <button onClick={() => deleteTodos(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {/* LOADER TRIGGER */}
      <div ref={loaderRef} style={{ height: "120px", margin: "30px" }}></div>

      {/* LOADING TEXT */}
      {loading && <p style={{ textAlign: "center" }}>Loading more...</p>}

      {/* END MESSAGE */}
      {!hasMore && !loading && (
        <p style={{ textAlign: "center", color: "gray" }}>No more todo left.</p>
      )}
    </div>
  );
}

export default App;
