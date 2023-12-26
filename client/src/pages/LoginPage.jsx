import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContextProvider";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (email && password) {
      try {
        const { data } = await axios.post("/login", {
          email,
          password,
        });
        setUser(data);
        setRedirect(true);
      } catch (error) {
        console.log(error);
        alert(error.response.data.msg);
      }
    } else {
      alert("please enter both email and password");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className=" mt-4 flex grow items-center justify-around">
      <div className=" -mt-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className=" max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
        </form>

        <div className=" text-center py-2 text-gray-500">
          Don`t have an accout yet?{"  "}
          <Link to={"/register"} className=" underline font-bold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
