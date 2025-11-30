import { useState } from "react";
import { BACKEND_URL } from "../constant";
import { Link, useNavigate } from "react-router";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [nameError, setNameError] = useState("");
  const [roomIdError, setRoomIdError] = useState("");
  const [isJoinScreen, setIsJoinScreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    if (isJoinScreen) {
      setIsJoinScreen(false);
      return;
    }

    if (!name?.trim()) {
      setNameError("Name field is mandatory.");
      return;
    }

    if (name?.trim()?.length < 3) {
      setNameError("Name must be atleast of 3 characters.");
      return;
    }

    setLoading(true);

    fetch(BACKEND_URL + "/createRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { roomId } = res?.data;

        console.log("Server response:", roomId);

        navigate("/room/" + roomId);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleJoinRoom = async () => {
    if (!isJoinScreen) {
      setIsJoinScreen(true);
      return;
    }

    if (!roomId?.trim()) {
      setRoomIdError("Room Id field is mandatory.");
      return;
    }

    setLoading(true);

    fetch(BACKEND_URL + "/validateRoomId/" + roomId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          setRoomIdError(res.msg);
        } else {
          navigate("/room/" + roomId);
        }
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="w-lg mx-auto mt-14">
        <h1 className="text-center">DevSync</h1>
        <div className="px-12 py-4 mt-6 border border-gray-300 rounded-lg text-center">
          <div className="py-4 text-left">
            <div className="mb-3">
              <label className="block py-2" htmlFor="name">
                Enter Name <span className="text-red-700">*</span>{" "}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                className="w-full border-2 p-2 "
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
              <span className="text-red-700 pt-2 text-sm">{nameError}</span>
            </div>
            {isJoinScreen && (
              <div>
                <label className="block py-2" htmlFor="roomId">
                  Enter Room Id <span className="text-red-700">*</span>{" "}
                </label>
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  className="w-full border-2 p-2 "
                  onChange={(e) => setRoomId(e.target.value)}
                  autoComplete="off"
                />
                <span className="text-red-700 pt-2 text-sm">{roomIdError}</span>
              </div>
            )}
          </div>

          <button
            className=" px-2 mt-6"
            onClick={isJoinScreen ? handleJoinRoom : handleCreateRoom}
          >
            {loading && "Loading..."}
            {!loading && isJoinScreen && "Join Room"}
            {!loading && !isJoinScreen && "Create Room"}
          </button>
          <Link
            onClick={() => setIsJoinScreen(!isJoinScreen)}
            className="block px-2 mt-6 ms-3 text-gray-400"
          >
            {isJoinScreen ? "Create A New Room ?" : "Join Existing Room ?"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
