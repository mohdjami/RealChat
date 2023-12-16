"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <h1>Send a message</h1>
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message..."
        />
        <button onClick={() => sendMessage(message)}>Send</button>
      </div>
      <div>
        {messages.map((e) => {
          return <div>{e}</div>;
        })}
      </div>
    </div>
  );
}
