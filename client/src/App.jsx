import { useState, useEffect, useRef } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase";
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
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

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
        {
          headers: getAuthHeaders(),
        },
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (loggingIn) return;

    setLoggingIn(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      localStorage.setItem("token", token);

      window.location.reload();
    } catch (err) {
      console.log("LOGIN ERROR:", err.message);
    }

    setLoggingIn(false);
  };

  const token = localStorage.getItem("token") || null;

  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Please Login First</h2>
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    );
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const loadMoreTodos = async () => {
    if (fetchingRef.current || !hasMore) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/todos-with-notes?limit=${limit}&skip=${skipRef.current}`,
        { headers: getAuthHeaders() },
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text: input }),
    });

    const newTodo = await res.json();

    // setTodos([...todos, newTodo]);
    setTodos((prev) => [...(prev || []), newTodo]);
    setInput("");
  };

  const addNote = async (todoId) => {
    const text = noteInput[todoId];

    if (!text) return;

    await fetch("http://localhost:3000/notes", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      headers: getAuthHeaders(),
      body: JSON.stringify({
        todoId,
        text_description: text,
      }),
    });

    // refresh data
    const res = await fetch(
      `http://localhost:3000/todos-with-notes?limit=${limit}&skip=0`,
      { headers: getAuthHeaders() },
    );

    if (!res.ok) {
      console.log("API FAILED");
      return;
    }

    const data = await res.json();
    setTodos(data.data);
    setSkip(limit);

    // clear input
    setNoteInput({ ...noteInput, [todoId]: "" });
  };

  const deleteTodos = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const toggleTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "0 20px",
        }}
      >
        <h1>Todo Application</h1>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              marginBottom: "5px",
              textDecoration: "underline",
              color: "gray",
            }}
          >
            My Profile
          </div>

          {user && (
            <>
              <div style={{ fontWeight: "bold", color: "#6b7280" }}>
                {user.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#6b7280",
                }}
              >
                {user.email}
              </div>
            </>
          )}

          <button onClick={handleLogout} style={{ marginTop: "8px" }}>
            Logout
          </button>
        </div>
      </div>

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
        {Array.isArray(todos) &&
          todos.map((todo) => (
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
