import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-mobile-datepicker';
import { format } from 'date-fns';
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
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleChange = (date) => {
    setDate(new Date(date));
  };

  const handleSelect = () => {
    const formattedDate = new Date(date)
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
    setIsOpen(false)
  }

  return (
    <>
    <a className="btn mobile-date-btn" onClick={handleClick}>{format(date,"P")}</a>
    <DatePicker value={date} isOpen={isOpen} onCancel={handleCancel} onChange={handleChange} onSelect={handleSelect} cancelText="Cancel" confirmText="Confirm" theme="ios" />
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

const TagToggleButton = (props) => {
  const [showTags, setShowTags] = useState(false);

  const tagToggle = () => {
    setShowTags(!showTags);
  };

  return (
    <>
      <button
        class="btn"
        data-toggle="collapse"
        data-target={
          "#collapse" + props.tagIndex.toString() + props.todo._id.toString()
        }
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
        style={{ border: `1px solid ${props.user.color}`, borderRadius: 10 }}
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
          <div class="wrapper my-auto col-6">
            <input
              class="px-2"
              placeholder="Start Typing"
              value={tag}
              onChange={handleChange}
            />
            <div class="mobile-tags-dropdown px-2">
              {autoTags.map((tag) => (
                <div
                  className="dropdown-tag"
                  key={tag}
                  onClick={() => handleClickTagAdd(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div class="col-1 px-1">
            <button class="btn" type="submit">
              <FaPlusCircle size={25} style={{ color: props.user.color }} />
            </button>
          </div>
        </div>
      </form>
    </>
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
    axios.delete(`${url}/todos/${id}`).then((res) => console.log(res));
    $(".collapse").collapse("hide");
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
      <>
        <div className="container-fluid m-0 mw-100">
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
        </div>
        <div className="container-fluid m-0 mt-4">
          {todos.map((todo) => (
            <>
              <div
                className="row justify-content-center py-2 todo-mobile"
                key={todo._id}
              >
                <div className="col-2 text-center my-auto mx-0 px-0">
                  <CompleteButton
                    user={props.user}
                    todo={todo}
                    markComplete={markComplete}
                  />
                </div>
                <div
                  className={`${todo.complete ? "complete" : ""} col-8 my-auto`}
                >
                  {todo.task}
                </div>
                <div className="col-2 text-center">
                  <ToggleButton user={props.user} todo={todo} />
                </div>
              </div>
              <div className="collapse" id={"collapse" + todo._id.toString()}>
                <div className="row mx-2 my-3">
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
                </div>
                <div className="row mx-2 my-3">
                  <TagForm
                    style={{
                      position: "absolute",
                      left: 0,
                    }}
                    todo={todo}
                    user={props.user}
                    globalTags={globalTags}
                  />
                </div>
                <div style={{border: `1px solid ${props.user.color}`, borderRadius: 10}} className="row mx-2 my-3 p-2">
                  <div className="col-4 pl-0 text-left">
                  <p className="my-auto" style={{fontWeight: 'bold', color: props.user.color}}>Due Date:</p>
                  </div>
                  <div className="col-4">
                    <DateButton user={props.user} todo={todo} />
                    </div>
                </div>
                <div className="row mx-2 my-3">
                  <button
                    style={{
                      color: "white",
                      backgroundColor: props.user.color,
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
          ))}
        </div>
      </>
    );
  } else {
    return (
      <div className="container mt-1">
        {tagLists.map((tag, index) => {
          let tagIndex = index;
          for (let i = 0; i < tag.list.length; i++) {
            tag.list[i].tagIndex = tagIndex;
          }

          return (
            <div className="container my-5">
              <h2 style={{ color: props.user.color }}>{tag.name}</h2>
              <>
                {tag.list.map((todo) => (
                  <>
                    <div
                      className="row justify-content-center py-2 todo-mobile"
                      key={todo._id}
                    >
                      <div className="col-2 text-center my-auto mx-0 px-0">
                        <CompleteButton
                          user={props.user}
                          todo={todo}
                          markComplete={markComplete}
                        />
                      </div>
                      <div
                        className={`${
                          todo.complete ? "complete" : ""
                        } col-8 my-auto`}
                      >
                        {todo.task}
                      </div>
                      <div className="col-2 text-center">
                        <TagToggleButton todo={todo} tagIndex={todo.tagIndex} />
                      </div>
                    </div>
                    <div
                      className="collapse"
                      id={
                        "collapse" +
                        todo.tagIndex.toString() +
                        todo._id.toString()
                      }
                    >
                      <div className="row mx-2 my-3">
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
                      </div>
                      <div className="row mx-2 my-3">
                        <TagForm
                          style={{
                            position: "absolute",
                            left: 0,
                          }}
                          todo={todo}
                          user={props.user}
                          globalTags={globalTags}
                        />
                      </div>
                      <div style={{border: `1px solid ${props.user.color}`, borderRadius: 10}} className="row mx-2 my-3 p-2">
                  <div className="col-4 pl-0 text-left">
                  <p className="my-auto" style={{fontWeight: 'bold', color: props.user.color}}>Due Date:</p>
                  </div>
                  <div className="col-4">
                    <DateButton user={props.user} todo={todo} />
                    </div>
                </div>
                      <div className="row mx-2 my-3">
                        <button
                          style={{
                            color: "white",
                            backgroundColor: props.user.color,
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
