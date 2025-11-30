import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "../socket";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const Editor = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState("");
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
        setData(res.data?.data);
        setUsers(res.data?.users);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected to socket server : ");
        navigate("/create-room", { replace: true });
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

  const handleInputChange = (value) => {
    isEditing.current = 1;
    setData(value);
  };

  const handleEndSession = () => {
    socket.emit("END_SESSION", { roomId });
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1/6 border-r border-gray-400 min-h-screen ">
        <h2 className="p-4 text-2xl text-center border-b border-gray-400">
          DevSync
        </h2>
        <div className="px-4">
          <div className="h-[80vh] overflow-y-auto ">
            {users.map((user) => (
              <div
                key={user}
                className="px-4 py-2 border-b-[0.5px] border-gray-50"
              >
                {user}
              </div>
            ))}
          </div>

          <div className="py-4 text-center bottom-0">
            <button
              className="text-white hover:border-red-600"
              style={{ background: "red" }}
              onClick={handleEndSession}
            >
              End Session
            </button>
          </div>
        </div>
      </div>
      <div className="flex-5/6 p-4">
        <CodeMirror
          height="90vh"
          value={data}
          extensions={[javascript({ jsx: true })]}
          onChange={handleInputChange}
          autoFocus={true}
          theme={"dark"}
        />
      </div>
    </div>
  );
};

export default Editor;
