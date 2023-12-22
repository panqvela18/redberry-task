import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/LOGO-02 3.svg";
import "../Styles/Add-blog.css";
import backArrow from "../assets/backArrow.svg";
import fileUploadImage from "../assets/folder-add.png";
import { Link, useNavigate } from "react-router-dom";
import { context } from "../App";
import arrowDown from "../assets/arrow-down.svg";
import api from "../Api/GetData";
import Cookies from "js-cookie";
import errorIcon from "../assets/error-infoIcon.svg";
import picIcon from "../assets/gallery.svg";
import closeBtn from "../assets/Xicon.svg";

export default function AddBlog() {
  const currentDate = new Date();
  const initialDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [authorInput, setAuthorInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [descriptionTextarea, setDescriptionTextarea] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailIsGood, setEmailIsGood] = useState(false);
  const [imageFile, setImageFile] = useState("");

  console.log(emailError);

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@redberry\.ge$/;

    if (emailRegex.test(emailInput)) {
      setEmailIsGood(true);
      setEmailError("");
    } else {
      setEmailIsGood(false);
      setEmailError("ელ-ფოსტა არ მოიძებნა");
    }
  };

  useEffect(() => {
    validateEmail();
  }, [emailInput]);
  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const AUTHOR_COOKIE = "authorInput";
  const TITLE_COOKIE = "titleInput";
  const DESCRIPTION_COOKIE = "descriptionTextarea";
  const DATE_COOKIE = "selectedDate";
  const EMAIL_COOKIE = "emailInput";
  


  useEffect(() => {
    const authorCookie = Cookies.get(AUTHOR_COOKIE);
    const titleCookie = Cookies.get(TITLE_COOKIE);
    const descriptionCookie = Cookies.get(DESCRIPTION_COOKIE);
    const dateCookie = Cookies.get(DATE_COOKIE);
    const emailCookie = Cookies.get(EMAIL_COOKIE);

    setAuthorInput(authorCookie || "");
    setTitleInput(titleCookie || "");
    setDescriptionTextarea(descriptionCookie || "");
    setSelectedDate(dateCookie || null);
    setEmailInput(emailCookie || "");
  }, []);

  // Update cookies whenever inputs change
  useEffect(() => {
    Cookies.set(AUTHOR_COOKIE, authorInput);
  }, [authorInput]);

  useEffect(() => {
    Cookies.set(TITLE_COOKIE, titleInput);
  }, [titleInput]);

  useEffect(() => {
    Cookies.set(DESCRIPTION_COOKIE, descriptionTextarea);
  }, [descriptionTextarea]);

  useEffect(() => {
    Cookies.set(DATE_COOKIE, selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    Cookies.set(EMAIL_COOKIE, emailInput);
  }, [emailInput]);

  console.log(selectedDate);
  // const userLoginContext = useContext(context)
  // const navigate=useNavigate()

  // useEffect(()=>{
  //  if(!userLoginContext.userLogin){
  //   navigate("/")
  //  }
  // })

  console.log(categories);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    // Handle the file change logic here
    console.log(e.target.files);
    setImageFile(e.target.files[0]);
  };
  const formData = new FormData();
  formData.append("image", imageFile);

  const isValidGeorgian = (input) => {
    // Georgian script Unicode range: U+10A0 to U+10FF, and allow space
    const georgianScriptRegex = /^[\u10A0-\u10FF\s]+$/;

    return georgianScriptRegex.test(input);
  };

  const submitForm = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Link to={"/"} className="add-blog-head">
        <img src={logo} alt="logo" />
      </Link>
      <main className="add-blog-main-container">
        <Link to={"/"}>
          <img className="back-arrow" src={backArrow} alt="arrow" />
        </Link>
        <form onSubmit={submitForm}>
          <h1 className="add-blog-main-title">ბლოგის დამატება</h1>
          <h5 className="add-blog-title">ატვირთეთ ფოტო *</h5>
          {imageFile === "" ? (
            <div className="upload-file-container">
              <img src={fileUploadImage} alt="fileUploadIcon" />
              <p className="upload-parag">
                ჩააგდეთ ფაილი აქ ან
                <label className="upload-span" style={{ marginLeft: "5px" }}>
                  აირჩიეთ ფაილი
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    value={imageFile}
                  />
                </label>
              </p>
            </div>
          ) : (
            <div className="uploaded-image-container">
              <div className="image-and-image-name">
                <img src={picIcon} alt="pic-icon" />
                <span>{imageFile.name}</span>
              </div>
              <img onClick={()=>setImageFile("")} src={closeBtn} alt="close-btn" />
            </div>
          )}

          <div className="auth-and-blog-container">
            <div className="add-blog-auth-cont">
              <h4 className="add-blog-title">ავტორი *</h4>
              <input
                className="add-blog-input"
                type="text"
                placeholder="შეიყვნეთ ავტორი"
                onChange={(e) => setAuthorInput(e.target.value)}
                value={authorInput}
              />
              <ul>
                <li
                  style={
                    authorInput.length === 0
                      ? { color: "#85858d" }
                      : authorInput.length < 4
                      ? { color: "#EA1919" }
                      : { color: "#14D81C" }
                  }
                >
                  მინიმუმ 4 სიმბოლო
                </li>
                <li
                  style={
                    authorInput.length === 0
                      ? { color: "#85858d" }
                      : authorInput.includes(" ")
                      ? { color: "#14D81C" }
                      : { color: "#EA1919" }
                  }
                >
                  მინიმუმ ორი სიტყვა
                </li>
                <li
                  style={
                    authorInput.length === 0
                      ? { color: "#85858d" }
                      : isValidGeorgian(authorInput)
                      ? { color: "#14D81C" }
                      : { color: "#EA1919" }
                  }
                >
                  მხოლოდ ქართული სიმბოლოები
                </li>
              </ul>
            </div>
            <div className="add-blog-title-cont">
              <h4 className="add-blog-title">სათაური *</h4>
              <input
                className="add-blog-input"
                type="text"
                placeholder="შეიყვნეთ სათაური"
                onChange={(e) => setTitleInput(e.target.value)}
                value={titleInput}
              />
              <span
                className="val-symbol"
                style={
                  titleInput.length === 0
                    ? { color: "#85858d" }
                    : titleInput.length < 4
                    ? { color: "#EA1919" }
                    : { color: "#14D81C" }
                }
              >
                მინიმუმ 4 სიმბოლო
              </span>
            </div>
          </div>
          <h5 className="add-blog-title">აღწერა *</h5>
          <textarea
            onChange={(e) => setDescriptionTextarea(e.target.value)}
            placeholder="შეიყვნანეთ აღწერა"
            value={descriptionTextarea}
          />
          <span
            style={
              descriptionTextarea.length === 0
                ? { color: "#85858d" }
                : descriptionTextarea.length < 4
                ? { color: "#EA1919" }
                : { color: "#14D81C" }
            }
            className="val-symbol"
          >
            მინიმუმ 4 სიმბოლო
          </span>

          <div className="date-categories-container">
            <div className="add-blog-auth-cont">
              <h5 className="add-blog-title">გამოქვეყნების თარიღი *</h5>
              <input
                className="date-input"
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
              />
            </div>
            <div className="cont-category">
              <h5 className="add-blog-title">კატეგორია</h5>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setShowDropDown(!showDropDown)}
              >
                <input
                  placeholder="შეიყვნეთ კატეგორია"
                  className="date-input"
                  type="text"
                  onChange={() => console.log("sadas")}
                />
                <img className="arrow-down" src={arrowDown} alt="arrow-down" />
              </div>
              {showDropDown && (
                <div className="category-dropDown">
                  {categories.map((category) => {
                    return (
                      <button
                        className="category-btn"
                        style={{
                          color: category.text_color,
                          backgroundColor: category.background_color,
                        }}
                        key={category.id}
                      >
                        {category.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <h4
            style={{ marginTop: "24px", marginBottom: "8px" }}
            className="add-blog-title"
          >
            ელ-ფოსტა *
          </h4>
          <input
            style={
              emailIsGood
                ? { border: "1px solid #14D81C" }
                : { border: "1px solid #EA1919" }
            }
            value={emailInput}
            onChange={handleEmailChange}
            className="email-input-blog"
            type="email"
            placeholder="Example@redbery.ge"
          />
          {emailError && (
            <div className="email-error-cont">
              <img src={errorIcon} alt="error-icon" />
              <p>{emailError}</p>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="add-blog-submit-btn" type="submit">
              გამოქვეყნება
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
