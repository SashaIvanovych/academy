import "./styles/App.scss";
import { useEffect, useState } from "react";
import { getHelloWorld } from "./services/api";

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getHelloWorld().then((res) => setData(res.message));
  }, []);
  return (
    <div className="App">
      <h1>{data || "Error"}</h1>
    </div>
  );
}
export default App;
