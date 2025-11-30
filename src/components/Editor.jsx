import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { socket } from "../socket";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Toast from "./Toast";
import CopySection from "./CopySection";

const Editor = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState("");
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    isError: false,
    message: "",
  });
  const isEditing = useRef(null);

  useEffect(() => {
    if (roomId) {
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        const name = localStorage.getItem("USER_NAME");

        socket.emit("PING", {
          msg: "Hi Server, I'm Client !!",
          roomId,
          name,
        });
      };

      socket.on("connect", onConnect);

      socket.on("PONG", (res) => {
        setData(res.data?.data);
        setUsers(res.data?.users);
      });

      socket.on("disconnect", () => {
        setToastConfig({ visible: true, message: "Session End." });

        setTimeout(() => navigate("/create-room", { replace: true }), 1000);
        localStorage.removeItem("USER_NAME");
      });

      socket.on("NEW_USER_JOINED", (data) => {
        if (data.success) {
          setToastConfig({ visible: true, message: data.msg });
        }
      });

      socket.on("INVALID_ROOM_ID", (data) => {
        if (data) {
          setToastConfig({ visible: true, isError: true, message: data.msg });

          setTimeout(() => navigate("/create-room", { replace: true }), 1000);
          localStorage.removeItem("USER_NAME");
        }
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
    setToastConfig({ visible: true, message: "Session end successfully !!" });
  };

  return (
    <>
      {toastConfig.visible && (
        <Toast
          message={toastConfig.message}
          isError={toastConfig.isError}
          onClose={() => setToastConfig({ visible: false })}
        />
      )}
      <div className="flex min-h-screen">
        <div className="flex-1/6 border-r border-gray-400 min-h-screen ">
          <h2 className="p-4 text-2xl text-center border-b border-gray-400">
            DevSync
          </h2>
          <div className="px-4">
            <div className="h-[75vh] overflow-y-auto ">
              {users.map((user) => (
                <div
                  key={user}
                  className="px-4 py-2 border-b-[0.5px] border-gray-50"
                >
                  {user}
                </div>
              ))}
            </div>

            <div className="py-4 flex flex-col items-center gap-2 bottom-0">
              <CopySection roomId={roomId} />
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800"
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
            placeholder={"Start typing your code here…"}
            onChange={handleInputChange}
            autoFocus={true}
            theme={"dark"}
          />
        </div>
      </div>
    </>
  );
};

export default Editor;
