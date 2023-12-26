import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerUser = async (ev) => {
    ev.preventDefault();
    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      alert("Registration Successful");
    } catch (error) {
      if (error.response) {
        console.log(error);
        alert(error.response.data.error);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className=" mt-4 flex grow items-center justify-around">
      <div className=" -mt-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className=" max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
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
          Already a member?{"  "}
          <Link to={"/login"} className=" underline font-bold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
