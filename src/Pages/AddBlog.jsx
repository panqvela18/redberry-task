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
import categoryXicon from "../assets/categoryXIcon.svg";
import { Modal } from "@mui/material";
import checked from "../assets/tick-circle.svg";

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
  const [emailIsGood, setEmailIsGood] = useState(0);
  const [imageFile, setImageFile] = useState("");
  const [allRigth, setAllRigth] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);

  console.log(selectedCategoriesId)

  const token =
"4614b9bb546a70d4b1c6561260ef92216d76706de0eb845a23f0d61fd50c652a";

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setEmailInput("");
    setSelectedCategories([]);
    setImageFile("");
    setSelectedDate(initialDate);
    setAuthorInput("");
    setTitleInput("");
    setDescriptionTextarea("");
  };

  useEffect(() => {
    const ids = categories
      .filter((item) => selectedCategories.includes(item.title))
      .map((item) => item.id);

    setSelectedCategoriesId(ids);
  }, [selectedCategories, categories]);

  const handleCategoryClick = (category) => {
    // Check if the maximum number of categories is already selected
    if (selectedCategories.length < 4) {
      // Check if the category is already in the selectedCategories array
      if (!selectedCategories.includes(category)) {
        // If not, add it to the array
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };
  

  const getCategoryStyles = (categoryTitle) => {
    const category = categories.find((c) => c.title === categoryTitle);
    return {
      backgroundColor: category?.background_color || "defaultBackgroundColor",
      color: category?.text_color || "defaultTextColor",
    };
  };

  const handleCategoryClose = (category) => {
    // Filter out the selected category from the array
    const updatedCategories = selectedCategories.filter(
      (selectedCategory) => selectedCategory !== category
    );
    setSelectedCategories(updatedCategories);
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@redberry\.ge$/;

    if (emailRegex.test(emailInput)) {
      setEmailIsGood(2);
      setEmailError("");
      return true;
    } else {
      setEmailIsGood(1);
      setEmailError("ელ-ფოსტა არ მოიძებნა");
      return false;
    }
  };

  // useEffect(() => {
  //   validateEmail();
  // }, [emailInput]);
  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleAuthorInputChange = (e) => {
    const value = e.target.value;
    const trimmedString = value.split(/\s+/).join(" ");
    setAuthorInput(trimmedString);
  };

  const handleTitleInputChange = (e) => {
    const value = e.target.value;
    const trimmedString = value.split(/\s+/).join(" ");
    setTitleInput(trimmedString);
  };

  const handleTextAreaChange = (e) => {
    const value = e.target.value;
    const trimmedString = value.split(/\s+/).join(" ");
    setDescriptionTextarea(trimmedString);
  };
  const AUTHOR_COOKIE = "authorInput";
  const TITLE_COOKIE = "titleInput";
  const DESCRIPTION_COOKIE = "descriptionTextarea";
  const DATE_COOKIE = "selectedDate";
  const EMAIL_COOKIE = "emailInput";
  const SELECTED_CATEGORIES_COOKIE = "selectedCategories";
  const SELECTED_CATEGORIES_ID_COOKIE = "selectedCategoriesId";

  useEffect(() => {
    const authorCookie = Cookies.get(AUTHOR_COOKIE);
    const titleCookie = Cookies.get(TITLE_COOKIE);
    const descriptionCookie = Cookies.get(DESCRIPTION_COOKIE);
    const dateCookie = Cookies.get(DATE_COOKIE);
    const emailCookie = Cookies.get(EMAIL_COOKIE);
    const selectedCategoriesCookie = Cookies.get(SELECTED_CATEGORIES_COOKIE);
    const selectedCategoriesIdCookie = Cookies.get(
      SELECTED_CATEGORIES_ID_COOKIE
    );

    setSelectedCategories(
      selectedCategoriesCookie ? JSON.parse(selectedCategoriesCookie) : []
    );
    setSelectedCategoriesId(
      selectedCategoriesIdCookie ? JSON.parse(selectedCategoriesIdCookie) : []
    );

    setAuthorInput(authorCookie || "");
    setTitleInput(titleCookie || "");
    setDescriptionTextarea(descriptionCookie || "");
    setSelectedDate(dateCookie || initialDate);
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

  useEffect(() => {
    Cookies.set(SELECTED_CATEGORIES_COOKIE, JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  useEffect(() => {
    Cookies.set(
      SELECTED_CATEGORIES_ID_COOKIE,
      JSON.stringify(selectedCategoriesId)
    );
  }, [selectedCategoriesId]);

  // const userLoginContext = useContext(context)
  // const navigate=useNavigate()

  // useEffect(()=>{
  //  if(!userLoginContext.userLogin){
  //   navigate("/")
  //  }
  // })


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
    const file = e.target.files[0];
  
    if (file) {
      setImageFile(file);
    }
  };
  
  
  //   const handleFileChange = (e) => {
  //   // Handle the file change logic here
  //   setImageName(e.target.files[0]);

  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     setImageFile(e.target.files[0]);
  //   };

  //   reader.readAsDataURL(e.target.files[0]);
  // };

  const isValidGeorgian = (input) => {
    // Georgian script Unicode range: U+10A0 to U+10FF, and allow space
    const georgianScriptRegex = /^[\u10A0-\u10FF\s]+$/;

    return georgianScriptRegex.test(input);
  };

  useEffect(() => {
    const isAllRigth =
      authorInput.length >= 4 &&
      authorInput.split(" ").filter((word) => word !== "").length > 1 &&
      isValidGeorgian(authorInput) &&
      titleInput.length >= 4 &&
      descriptionTextarea.length >= 4 &&
      selectedDate &&
      validateEmail() &&
      selectedCategories.length > 0 &&
      imageFile !== "";

    setAllRigth(isAllRigth);
  }, [
    authorInput,
    titleInput,
    descriptionTextarea,
    selectedDate,
    validateEmail,
    selectedCategories,
    imageFile,
  ]);

  const submitForm = async (e) => {
  e.preventDefault();
  try {
    setOpen(true);

    const formData = new FormData();
    formData.append("title", titleInput);
    formData.append("description", descriptionTextarea);
    formData.append("image", imageFile); 
    formData.append("author", authorInput);
    formData.append("publish_date", selectedDate);
    formData.append("categories", JSON.stringify(selectedCategoriesId));
    formData.append("email", emailInput);

   const response =  await api.post("https://api.blog.redberryinternship.ge/api/blogs", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response)
    if(response.status === 204){
      setEmailInput("");
      setSelectedCategories([]);
      setImageFile("");
      setSelectedDate(initialDate);
      setAuthorInput("");
      setTitleInput("");
      setDescriptionTextarea("");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
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
        <form
          encType="multipart/form-data"
          style={{ padding: "0 13%" }}
          onSubmit={submitForm}
        >
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
                <span>{imageFile.type}</span>
              </div>
              <img
                onClick={() => setImageFile("")}
                src={closeBtn}
                alt="close-btn"
              />
            </div>
          )}

          <div className="auth-and-blog-container">
            <div className="add-blog-auth-cont">
              <h4 className="add-blog-title">ავტორი *</h4>
              <input
                className="add-blog-input"
                type="text"
                placeholder="შეიყვნეთ ავტორი"
                onChange={handleAuthorInputChange}
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
                      : authorInput.split(" ").filter((word) => word !== "")
                          .length > 1
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
                onChange={handleTitleInputChange}
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
            onChange={handleTextAreaChange}
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
              <div style={{ cursor: "pointer" }}>
                <div className="selectCategory-cont">
                  {selectedCategories.length === 0
                    ? "შეიყვნეთ კატეგორია"
                    : selectedCategories.map((selectCategory) => {
                        return (
                          <div
                            onClick={() => handleCategoryClose(selectCategory)}
                            className="selected-category-btn"
                            style={getCategoryStyles(selectCategory)}
                          >
                            {selectCategory}{" "}
                            <img src={categoryXicon} alt="categoryXicon" />
                          </div>
                        );
                      })}
                </div>
                <img
                  onClick={() => setShowDropDown(!showDropDown)}
                  className="arrow-down"
                  src={arrowDown}
                  alt="arrow-down"
                />
              </div>
              {showDropDown && (
                <div className="category-dropDown">
                  {categories.map((category) => {
                    return (
                      <div
                        onClick={() => handleCategoryClick(category.title)}
                        className="category-btn"
                        style={{
                          color: category.text_color,
                          backgroundColor: category.background_color,
                        }}
                        key={category.id}
                      >
                        {category.title}
                      </div>
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
              emailIsGood === 0
                ? { border: "1px solid #E4E3EB" }
                : emailIsGood === 1
                ? { border: "1px solid #EA1919" }
                : { border: "1px solid #14D81C" }
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
            {allRigth ? (
              <button className="add-blog-submit-btn" type="submit">
                გამოქვეყნება
              </button>
            ) : (
              <button
                disabled
                className="add-blog-submit-btn-disable"
              >
                გამოქვეყნება
              </button>
            )}
          </div>
        </form>
      </main>
      <Modal open={open} onClose={handleClose}>
        <div className="add-blog-modal-container">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <img onClick={handleClose} src={closeBtn} alt="close-btn" />
          </div>
          <div className="upload-blog-modal-container">
            <img src={checked} alt="checked" />
            <h3>ჩანაწი წარმატებით დაემატა</h3>
            <button>
              <Link style={{ color: "white", textDecoration: "none" }} to={"/"}>
                მთავარ გვერდზე დაბრუნება{" "}
              </Link>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
