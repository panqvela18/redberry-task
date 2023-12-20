import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddBlog from "./Pages/AddBlog";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const context = createContext({});

function App() {
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    const storedUserLogin = Cookies.get("userLogin");

    if (storedUserLogin === "loggedIn") {
      setUserLogin(true);
    }
  }, []); 

  // Function to handle login
  const handleLogin = () => {
    Cookies.set("userLogin", "loggedIn");
    setUserLogin(true);
  };

  console.log(userLogin);

  return (
    <context.Provider value={{ userLogin, setUserLogin, handleLogin }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-blog" element={<AddBlog />} />
        </Routes>
      </BrowserRouter>
    </context.Provider>
  );
}

export default App;
