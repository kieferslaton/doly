import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaRegCircle,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa";

const url = ""

const DeleteButton = (props) => {
  const [hover, setHover] = useState(false);

  const hoverToggle = () => {
    setHover(!hover);
  };

  return (
    <FaRegTimesCircle
      size={30}
      onMouseEnter={() => hoverToggle()}
      onMouseLeave={() => hoverToggle()}
      style={{
        color: hover ? props.user.color : "#292b2c",
        cursor: hover ? "pointer" : "default",
      }}
      onClick={() => props.removeTask(props.todo._id)}
    />
  );
};

const CompleteButton = (props) => {
  const [hover, setHover] = useState(false);

  const hoverToggle = () => {
    setHover(!hover);
  };

  const handleClick = () => {
    props.markComplete(props.todo);
    setHover(false);
  };

  return (
    <>
      <FaRegCircle
        size={30}
        onMouseEnter={() => hoverToggle()}
        onMouseLeave={() => hoverToggle()}
        style={{
          color: hover ? props.user.color : "#292b2c",
          cursor: hover ? "pointer" : "default",
        }}
        className={props.todo.complete ? "d-none" : ""}
        onClick={handleClick}
      />
      <FaRegCheckCircle
        size={30}
        onMouseEnter={() => hoverToggle()}
        onMouseLeave={() => hoverToggle()}
        style={{
          color: hover ? props.user.color : "#292b2c",
          cursor: hover ? "pointer" : "default",
        }}
        className={props.todo.complete ? "" : "d-none"}
        onClick={handleClick}
      />
    </>
  );
};

const TagForm = (props) => {
  const [tag, setTag] = useState("");
  const [autoTags, setAutoTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let tags = props.todo.tags;
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
    axios
      .post(`${url}/todos/update/${props.todo._id}`, {
        task: props.todo.task,
        username: props.todo.username,
        due: props.todo.due,
        complete: props.todo.complete,
        tags: tags,
      })
      .then((res) => console.log(res));
    setTag("");
  };

  const handleChange = (e) => {
    e.target.value.length
      ? setAutoTags(
          props.globalTags.filter((tagName) =>
            tagName.toLowerCase().startsWith(e.target.value.toLowerCase())
          )
        )
      : setAutoTags([]);
    setTag(
      e.target.value
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ")
    );
  };

  const handleClickTagAdd = (divTag) => {
    let tags = props.todo.tags;
    if (!tags.includes(divTag)) {
      tags.push(divTag);
    }
    axios
      .post(`${url}/todos/update/${props.todo._id}`, {
        task: props.todo.task,
        username: props.todo.username,
        due: props.todo.due,
        complete: props.todo.complete,
        tags: tags,
      })
      .then((res) => console.log(res));
  };

  return (
    <div className="dropdown">
      <button
        className="btn tag-btn p-2 m-1 dropdown-toggle"
        style={{
          color: props.user.color,
          border: `1px solid ${props.user.color}`,
        }}
        data-toggle="dropdown"
      >
        Add Tag +
      </button>
      <form
        className="dropdown-menu p-2"
        style={{ border: `1px solid ${props.user.color}` }}
        onSubmit={handleSubmit}
      >
        <input placeholder="Add Tag" value={tag} onChange={handleChange} />
        {autoTags.map((tag) => (
          <div
            className="dropdown-tag"
            key={tag}
            onClick={() => handleClickTagAdd(tag)}
          >
            {tag}
          </div>
        ))}
      </form>
    </div>
  );
};

const TodoList = (props) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [globalTags, setGlobalTags] = useState();
  const [tagLists, setTagLists] = useState([]);

  const refreshTodos = () => {
    axios.get(`${url}/todos/`).then((res) => {
      setTodos(
        res.data.filter((todo) => todo.username === props.user.username)
      );
    });
  };

  const refreshGlobalTags = () => {
    let tempTags = [];
    for (let i = 0; i < todos.length; i++) {
      for (let j = 0; j < todos[i].tags.length; j++) {
        if (!tempTags.includes(todos[i].tags[j])) {
          tempTags.push(todos[i].tags[j]);
        }
      }
    }
    setGlobalTags(tempTags);
  };

  const refreshTagLists = () => {
    if (todos.length && globalTags.length) {
      let tagArray = [];
      for (let i = 0; i < globalTags.length; i++) {
        let tagObject = {
          name: globalTags[i],
          list: [],
        };
        let tagList = [];
        for (let j = 0; j < todos.length; j++) {
          if (todos[j].tags.includes(globalTags[i])) {
            tagList.push(todos[j]);
          }
        }
        tagObject.list = tagList;
        tagArray.push(tagObject);
      }
      setTagLists(tagArray);
    }
  };

  useEffect(() => {
    refreshGlobalTags();
  }, [todos]);

  useEffect(() => {
    refreshTodos();
  }, [todos]);

  useEffect(() => {
    refreshTagLists();
  }, [todos]);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${url}/todos/add`, {
        task,
        username: props.user.username,
      })
      .then((res) => console.log(res));
    setTask("");
  };

  const markComplete = (todo) => {
    axios
      .post(`${url}/todos/update/${todo._id}`, {
        task: todo.task,
        username: todo.username,
        due: todo.due,
        tags: todo.tags,
        complete: !todo.complete,
      })
      .then((res) => console.log(res));
  };

  const removeTask = (id) => {
    axios
      .delete(`${url}/todos/${id}`)
      .then((res) => console.log(res));
  };

  const removeTag = (todo, tag) => {
    axios
      .post(`${url}/todos/update/${todo._id}`, {
        task: todo.task,
        username: todo.username,
        due: todo.due,
        complete: todo.complete,
        tags: todo.tags.filter((item) => item !== tag),
      })
      .then((res) => console.log(res));
  };

  if (props.isInbox) {
    return (
      <div className="container-fluid m-1 mw-100">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <input
                className="w-100 border border-dark rounded p-2 text-center"
                value={task}
                onChange={handleChange}
                placeholder="New Task"
              />
            </form>
          </div>
        </div>
        <div className="container-fluid m-0 mt-4">
          {todos.map((todo) => (
            <div
              className="row justify-content-center py-2 todo"
              key={todo._id}
            >
              <div className="col-1 text-center my-auto">
                <CompleteButton
                  user={props.user}
                  todo={todo}
                  markComplete={markComplete}
                />
              </div>
              <div
                className={`${todo.complete ? "complete" : ""} col-4 my-auto`}
              >
                {todo.task}
              </div>
              <div className="col-6">
                {todo.tags.map((tag) => (
                  <div
                    key={tag}
                    className="tag p-2 m-1"
                    style={{
                      color: props.user.color,
                      border: `1px solid ${props.user.color}`,
                    }}
                  >
                    {`${tag}  `}
                    <span
                      className="pointer rotate"
                      onClick={() => removeTag(todo, tag)}
                    >
                      +
                    </span>
                  </div>
                ))}
                <TagForm
                  todo={todo}
                  user={props.user}
                  globalTags={globalTags}
                />
              </div>
              <div className="col-1 my-auto text-right">
                <DeleteButton
                  user={props.user}
                  todo={todo}
                  removeTask={removeTask}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mt-1">
        {tagLists.map((tag) => (
          <div className="container my-5">
            <h2 style={{ color: props.user.color }}>{tag.name}</h2>
            <>
              {tag.list.map((todo) => (
                <div
                  className="row justify-content-center py-2 todo"
                  key={todo._id}
                >
                  <div className="col-1 my-auto">
                    <CompleteButton
                      user={props.user}
                      todo={todo}
                      markComplete={markComplete}
                    />
                  </div>
                  <div
                    className={`${
                      todo.complete ? "complete" : ""
                    } col-4 my-auto`}
                  >
                    {todo.task}
                  </div>
                  <div className="col-6">
                    {todo.tags.map((tag) => (
                      <div
                        key={tag}
                        className="tag p-2 m-1"
                        style={{
                          color: props.user.color,
                          border: `1px solid ${props.user.color}`,
                        }}
                      >
                        {`${tag}  `}
                        <span
                          className="pointer rotate"
                          onClick={() => removeTag(todo, tag)}
                        >
                          +
                        </span>
                      </div>
                    ))}
                    <TagForm
                      todo={todo}
                      user={props.user}
                      globalTags={globalTags}
                    />
                  </div>
                  <div className="col-1 my-auto text-right">
                    <DeleteButton
                      user={props.user}
                      todo={todo}
                      removeTask={removeTask}
                    />
                  </div>
                </div>
              ))}
            </>
          </div>
        ))}
      </div>
    );
  }
};

export default TodoList;
