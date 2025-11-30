import { Navigate, Route, Routes } from "react-router";
import CreateRoom from "./components/createRoom";
import Editor from "./components/Editor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace={true} to="/create-room" />} />
      <Route path="/create-room" element={<CreateRoom />} />
      <Route path="/room/:roomId" element={<Editor />} />
    </Routes>
  );
}

export default App;
