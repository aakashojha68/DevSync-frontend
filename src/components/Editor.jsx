import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { socket } from "../socket";

const Editor = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState("");
  //   const [isEditing, setIsEditing] = useState(false);
  const isEditing = useRef(null);

  useEffect(() => {
    if (roomId) {
      console.log("roomId ", roomId);

      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        console.log("Connection established with socket.id = ", socket.id);

        socket.emit("PING", {
          msg: "Hi Server, I'm Client !!",
          roomId,
        });
      };

      socket.on("connect", onConnect);

      socket.on("PONG", (res) => {
        console.log("Received PONG from server:", res);
        setData(res.data.data);
        setUsers(res.data.users);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected to socket server : ");
      });

      return () => {
        // always clean up listener, no need to clean up emitters
        socket.off("connect");
        socket.off("disconnect");
        socket.off("UPDATED_CODE");
        socket.off("PONG");
        socket.disconnect();
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId && isEditing.current) {
      socket.emit("CODE_CHANGED", { data, roomId });
    }
  }, [data, roomId, isEditing.current]);

  const handleInputChange = (e) => {
    isEditing.current = 1;
    setData(e.target.value);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 border-r border-gray-400 min-h-screen p-4">
        {users.map((user) => (
          <div key={user} className="px-4 py-2 border-b border-gray-300">
            {user}
          </div>
        ))}
      </div>
      <div className="flex-3 p-4">
        <textarea
          className="border-2"
          value={data}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Editor;
