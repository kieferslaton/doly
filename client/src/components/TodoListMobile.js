import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-mobile-datepicker";
import { format } from "date-fns";
import $ from "jquery";
import {
  FaRegCircle,
  FaRegCheckCircle,
  FaPlusCircle,
  FaRegTrashAlt,
  FaChevronCircleDown,
  FaChevronCircleUp,
} from "react-icons/fa";

const url = "";

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

const DateButton = (props) => {
  const [date, setDate] = useState(
    props.todo.due ? new Date(props.todo.due) : new Date()
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const formattedDate = new Date(e.target.value.replace(/-/g, "/"));
    console.log(formattedDate);
    axios
      .post(`${url}/todos/update/${props.todo._id}`, {
        task: props.todo.task,
        username: props.todo.username,
        due: formattedDate,
        complete: props.todo.complete,
        tags: props.todo.tags,
      })
      .then((res) => console.log(res));
    setDate(formattedDate);
  };

  return (
    <>
      <input
        style={{
          position: 'relative',
          left: -10,
          whiteSpace: 'nowrap'
        }}
        className="date-btn-mobile mx-0"
        value={format(date, "yyyy-MM-dd")}
        type="date"
        onChange={handleChange}
      />
    </>
  );
};

const ToggleButton = (props) => {
  const [showTags, setShowTags] = useState(false);

  const tagToggle = () => {
    setShowTags(!showTags);
  };

  return (
    <>
      <button
        class="btn"
        data-toggle="collapse"
        data-target={"#collapse" + props.todo._id.toString()}
        onClick={() => tagToggle()}
      >
        {showTags ? (
          <FaChevronCircleUp style={{ color: "#292b2c" }} size={30} />
        ) : (
          <FaChevronCircleDown style={{ color: "#292b2c" }} size={30} />
        )}
      </button>
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
    $("#modal" + props.index).modal("hide");
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
    <>
      <form
        className="w-100 justify-content-center px-2"
        onSubmit={handleSubmit}
      >
        <div className="row">
          <p
            className="my-auto col-4"
            style={{
              fontSize: "1em",
              color: props.user.color,
              fontWeight: "bold",
            }}
          >
            Add Tag:
          </p>
          <div class="wrapper my-auto col-6 px-0">
            <input
              class="px-1 mw-100 w-70"
              placeholder="Start Typing"
              value={tag}
              onChange={handleChange}
            />
            <div class="mobile-tags-dropdown px-2">
              {autoTags.map((tag) => (
                <div
                  className="dropdown-tag m-1"
                  key={tag}
                  onClick={() => handleClickTagAdd(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div class="col-1">
            <button class="btn" type="submit">
              <FaPlusCircle size={25} style={{ color: props.user.color }} />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

const TodoForm = ({ user }) => {
  const [task, setTask] = useState("");

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${url}/todos/add`, {
        task,
        username: user.username,
      })
      .then((res) => console.log(res));
    setTask("");
  };

  return (
    <div className="container-fluid m-0 mw-100">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <form onSubmit={handleSubmit}>
            <input
              style={{
                border: `1px solid #d3d3d3`
              }}
              className="w-100 rounded p-2 text-center"
              value={task}
              onChange={handleChange}
              placeholder="New Task"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

const Todo = ({ user, todo, globalTags, removeTask }) => {
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

  return (
    <>
      <div
        className="row justify-content-center p-2 todo-mobile mx-0 mw-100 w-100"
        key={todo._id}
      >
        <div className="col-2 text-center my-auto mx-0 px-0">
          <CompleteButton user={user} todo={todo} markComplete={markComplete} />
        </div>
        <div className={`${todo.complete ? "complete" : ""} col-7 my-auto`}>
          {todo.task}
        </div>
        <div className="col-2 text-center">
          <ToggleButton user={user} todo={todo} />
        </div>
      </div>
      <div className="w-100 collapse container-fluid px-1 my-0 pt-2 pb-3 todo-drop-mobile" id={"collapse" + todo._id.toString()}>
        <div className="row mx-2 my-2">
          {todo.tags.map((tag) => (
            <div
              key={tag}
              className="tag p-2 m-1"
              style={{
                color: user.color,
                border: `1px solid ${user.color}`,
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
        </div>
        <div className="row mx-2 my-2">
          <TagForm
            todo={todo}
            user={user}
            globalTags={globalTags}
          />
        </div>
        <div
          className="row mx-2 my-2 p-2"
        >
          <div className="col-4 pl-0 text-left">
            <p
              className="my-auto"
              style={{ fontWeight: "bold", color: user.color }}
            >
              Due Date:
            </p>
          </div>
          <div className="col-4 pl-0">
            <DateButton user={user} todo={todo} />
          </div>
        </div>
        <div className="row mx-2 my-2">
          <button
            style={{
              color: "white",
              backgroundColor: user.color,
              borderRadius: 10,
            }}
            class="btn"
            onClick={() => removeTask(todo._id)}
          >
            Delete Task <FaRegTrashAlt />
          </button>
        </div>
      </div>
      </>
  );
};

const TodoList = (props) => {
  const [todos, setTodos] = useState([]);
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

  const removeTask = (id) => {
    axios.delete(`${url}/todos/${id}`).then((res) => console.log(res));
    $(".collapse").collapse("hide");
  };

  if (props.isInbox) {
    return (
      <>
        <TodoForm user={props.user} />
        <div className="container-fluid mt-3 px-0 mw-100">
          {todos.map((todo) => (
            <Todo
              todo={todo}
              user={props.user}
              removeTask={removeTask}
              globalTags={globalTags}
            />
          ))}
        </div>
      </>
    );
  } else {
    return (
      <div className="container mt-1 px-0 mw-100">
        {tagLists.map((tag, index) => {
          let tagIndex = index;
          for (let i = 0; i < tag.list.length; i++) {
            tag.list[i].tagIndex = tagIndex;
          }

          return (
            <div className="container my-5 px-0">
              <h2 style={{ color: props.user.color }} className="mx-3">{tag.name}</h2>
              <>
                {tag.list.map((todo) => (
                  <Todo
                  todo={todo}
                  user={props.user}
                  removeTask={removeTask}
                  globalTags={globalTags}
                />
                ))}
              </>
            </div>
          );
        })}
      </div>
    );
  }
};

export default TodoList;
