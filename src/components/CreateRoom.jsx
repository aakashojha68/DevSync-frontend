import React, { useState } from "react";
import { BACKEND_URL } from "../constant";
import { useNavigate } from "react-router";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const [error, setError] = useState("");

  const handleCreateRoom = () => {
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
      .catch(console.log);
  };

  const handleEnterRoom = async () => {
    fetch(BACKEND_URL + "/validateRoomId/" + roomId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((res) => {
        // const { roomId } = res?.data;

        if (!res.success) {
          setError(res.msg);
        } else {
          navigate("/room/" + roomId);
        }
      })
      .catch(console.log);
  };

  return (
    <div>
      <div className="flex justify-center gap-5 mt-6">
        <div className="flex gap-3 items-center">
          <div>
            <label>Enter Name : </label>
            <input
              type="text"
              value={name}
              className="border-2 p-2 "
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button className="px-2" onClick={handleCreateRoom}>
            Create Room
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <div>
            <label>Enter Room Id : </label>
            <input
              type="text"
              value={roomId}
              className="border-2 p-2 "
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>

          <button className="px-2" onClick={handleEnterRoom}>
            Enter in Room
          </button>
        </div>
      </div>
      <p className="text-red-700">{error}</p>
    </div>
  );
};

export default CreateRoom;
