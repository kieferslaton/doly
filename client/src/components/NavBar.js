import React, { useState } from "react";
import { FaCheckDouble, FaTags, FaInbox } from "react-icons/fa";
import { IoIosColorPalette, IoIosLogOut } from "react-icons/io";

const SwitchButton = (props) => {
  const [hover, setHover] = useState(false);

  const hoverToggle = () => {
    setHover(!hover);
  };

  const handleClick = () => {
    props.handleTagsToggle();
    setHover(false);
  };

  return (
    <>
      <button
        class={`${props.user && props.isInbox ? "" : "d-none"} btn`}
        style={{
          color: hover ? "white" : props.navColor,
          backgroundColor: hover ? props.navColor : "",
          fontWeight: "bold",
          border: `1px solid ${props.navColor}`,
        }}
        onClick={handleClick}
        onMouseEnter={() => hoverToggle()}
        onMouseLeave={() => hoverToggle()}
      >
        {props.size.width > 768?
        <div>Tags <FaTags size={20} /></div> :
        <FaTags size={25} />}
      </button>
      <button
        class={`${props.user && !props.isInbox ? "" : "d-none"} btn`}
        style={{
          color: hover ? "white" : props.navColor,
          backgroundColor: hover ? props.navColor : "",
          fontWeight: "bold",
          border: `1px solid ${props.navColor}`,
        }}
        onClick={handleClick}
        onMouseEnter={() => hoverToggle()}
        onMouseLeave={() => hoverToggle()}
      >
        {props.size.width > 768?
        <div>Inbox <FaInbox size={20} /></div> :
        <FaInbox size={25} />}
      </button>
    </>
  );
};

const ColorButton = (props) => {
  const [hover, setHover] = useState(false);

  const hoverToggle = () => {
    setHover(!hover);
  };
  return (
    <button
      class={`${props.user ? "" : "d-none"} dropdown-toggle btn my-auto mx-3`}
      data-toggle="dropdown"
      style={{
        color: hover ? "white" : props.navColor,
        backgroundColor: hover ? props.navColor : "",
        fontWeight: "bold",
        border: `1px solid ${props.navColor}`,
      }}
      onMouseEnter={() => hoverToggle()}
      onMouseLeave={() => hoverToggle()}
    >
      {props.size.width > 768?
        <div>Color <IoIosColorPalette size={20} /></div> :
        <IoIosColorPalette size={25} />}
    </button>
  );
};

const LogOutButton = (props) => {
  const [hover, setHover] = useState(false);

  const hoverToggle = () => {
    setHover(!hover);
  };

  return (
    <button
      class={`${props.user ? "" : "d-none"} btn log-out`}
      style={{
        color: hover ? "white" : props.navColor,
        backgroundColor: hover ? props.navColor : "",
        fontWeight: "bold",
        border: `1px solid ${props.navColor}`,
      }}
      onClick={() => props.logOut()}
      onMouseEnter={() => hoverToggle()}
      onMouseLeave={() => hoverToggle()}
    >
      {props.size.width > 768?
        <div>Log Out <IoIosLogOut size={20} /></div> :
        <IoIosLogOut size={25} />}
    </button>
  );
};

const NavBar = (props) => {
  const navColor = props.user ? props.user.color : "#292b2c";

  return (
    <nav class="navbar mb-5 py-2">
      <a class="navbar-brand m-0 p-0" href="#" style={{ color: navColor }}>
        do.ly
        <FaCheckDouble />
      </a>
      <div className="mr-1 row">
        <SwitchButton
          user={props.user}
          isInbox={props.isInbox}
          navColor={navColor}
          handleTagsToggle={props.handleTagsToggle}
          size={props.size}
        />
        <div className="dropdown my-auto">
          <ColorButton
            user={props.user}
            navColor={navColor}
            size={props.size}
          />
          <div
            className="dropdown-menu"
            style={{ backgroundColor: "white", border: "1px solid black" }}
          >
            <div className="row justify-content-center">
              <div
                className="m-1"
                onClick={(e) =>
                  props.setUserColor(e.target.style.backgroundColor)
                }
                style={{ backgroundColor: "#B64B51", height: 30, width: 30 }}
              ></div>
              <div
                className="m-1"
                onClick={(e) =>
                  props.setUserColor(e.target.style.backgroundColor)
                }
                style={{ backgroundColor: "#5f956b", height: 30, width: 30 }}
              ></div>
              <div
                className="m-1"
                onClick={(e) =>
                  props.setUserColor(e.target.style.backgroundColor)
                }
                style={{ backgroundColor: "#4e83a0", height: 30, width: 30 }}
              ></div>
            </div>
            <div className="row justify-content-center">
              <div
                className="m-1"
                onClick={(e) =>
                  props.setUserColor(e.target.style.backgroundColor)
                }
                style={{ backgroundColor: "#b09f38", height: 30, width: 30 }}
              ></div>
              <div
                className="m-1"
                onClick={(e) =>
                  props.setUserColor(e.target.style.backgroundColor)
                }
                style={{ backgroundColor: "#b27e41", height: 30, width: 30 }}
              ></div>
              <div
                className="m-1"
                onClick={(e) =>
                  props.setUserColor(e.target.style.backgroundColor)
                }
                style={{ backgroundColor: "#856197", height: 30, width: 30 }}
              ></div>
            </div>
          </div>
        </div>
        <LogOutButton
          user={props.user}
          logOut={props.logOut}
          navColor={navColor}
          size={props.size}
        />
      </div>
    </nav>
  );
};

export default NavBar;
