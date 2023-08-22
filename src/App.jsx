/* eslint-disable no-unused-vars */
import "./App.css";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data, isMine: false }]);
    });

    socket.on("my_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data, isMine: true }]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("my_message");
    };
  }, []);

  const messageListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  //states ends

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {message, roomId});
      setMessage("");
    }
  };

  const handleKeyDown = (e) =>{
    if(e.key === "Enter"){
      sendMessage()
    }
  }

  const joinRoom = () => {
    // Implement room joining logic here
    if(roomId !== ""){
      socket.emit("join_room", roomId)
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="box">
          <h3>Socket IO app</h3>
          <div className="room">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
          <div className="message_sec">
            <div className="message_input">
              <input
                type="text"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={sendMessage}>Send Message</button>
            </div>
            <div className="all_message">
              <ul ref={messageListRef}>
                {messages.map((item, i) => (
                  <li key={i} className={item.isMine ? "active" : ""}>
                    <span>
                      <i className="fa-regular fa-user"></i>
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
