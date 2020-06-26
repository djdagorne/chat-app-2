import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

import InfoBar from "../InfoBar/InfoBar.js";
import Input from "../Input/Input.js";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    //location comes from react-router and gives a prop called location that returns info about the URL.
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    //emits an event, give a string for the backend to recognize, then a value to pass to it
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        console.log(error);
      }
      console.log("joining");
    });

    return () => {
      socket.emit("disconnect");
      console.log("disconnected");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  //function for sending messages
  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
