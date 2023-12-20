import React, { useState } from "react";
import logo from "../assets/LOGO-02 3.svg";
import "../Styles/Header.css";
import Modal from "@mui/material/Modal";
import closeIcon from "../assets/Xicon.svg";
import errorIcon from "../assets/error-infoIcon.svg";
import api from "../Api/GetData";
import succesIcon from "../assets/tick-circle.svg";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [userLogin, setUserLogin] = useState(false);

  const token =
    "4614b9bb546a70d4b1c6561260ef92216d76706de0eb845a23f0d61fd50c652a";

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@redberry\.ge$/;

    if (!emailRegex.test(email)) {
      setError("ელ-ფოსტა არ მოიძებნა");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmail();

    try {
      const response = await api.post("/login", { email: email });

      setUserLogin(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <img src={logo} alt="logo" />
      {userLogin ? (
        <Link to={"/add-blog"}>
          <button>დაამატე ბლოგი</button>
        </Link>
      ) : (
        <button onClick={handleOpen}>შესვლა</button>
      )}
      <Modal open={open} onClose={handleClose}>
        <div className="modal-container">
          <img className="close-icon" src={closeIcon} alt="closeIcon" />
          {userLogin ? (
            <>
              <div className="succesContainer">
                <img src={succesIcon} alt="succesIcon" />
                <p>წარმატებული ავტორიზაცია</p>
              </div>
              <button onClick={handleClose} className="ok-btn">
                კარგი
              </button>
            </>
          ) : (
            <>
              <h3 className="modal-title">შესვლა</h3>
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label className="email-label">ელ-ფოსტა</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  type="text"
                  placeholder="Example@redberry.ge"
                />
                {error && (
                  <div className="email-error-cont">
                    <img src={errorIcon} alt="error-icon" />
                    <p>{error}</p>
                  </div>
                )}
                <button className="email-submit-btn" type="submit">
                  შესვლა
                </button>
              </form>
            </>
          )}
        </div>
      </Modal>
    </header>
  );
}
