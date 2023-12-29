import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddBlog from "./Pages/AddBlog";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import BlogDetail from "./Pages/BlogDetail";

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

    // Function to handle logout
    const handleLogout = () => {
      // Remove the session cookie (log out)
      Cookies.set("userLogin","loggedOut");
      // Update local state
      setUserLogin(false);
    };
  console.log(userLogin);

  return (
    <context.Provider value={{ userLogin, setUserLogin, handleLogin,handleLogout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/redberry-task" element={<Home />} />
          <Route path="/redberry-task/add-blog" element={<AddBlog />} />
          <Route path="/redberry-task/blog/:id" element={<BlogDetail />} />
        </Routes>
      </BrowserRouter>
    </context.Provider>
  );
}

export default App;
