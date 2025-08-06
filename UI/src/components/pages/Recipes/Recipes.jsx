import { useEffect, useState } from "react";
import { AuthService } from "../../../services/auth";
function Recipes() {
  const [data, setData] = useState(null);
  const handleClick = () => {
    setData(AuthService.getProfile());

    console.log(data);
  };
  return <button onClick={() => handleClick}>Click</button>;
}

export default Recipes;
