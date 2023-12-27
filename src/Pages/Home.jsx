import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/Home.css";
import blogImage from "../assets/Blog-1024x355 1.png";
import api from "../Api/GetData";
import arrow from "../assets/Arrow 1.svg";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);
  console.log(selectedCategoriesId);

  console.log(blogs);

  const handleCategoryClick = (id) => {
    if (!selectedCategoriesId.includes(id)) {
      const newSelectedCategories = [...selectedCategoriesId, id];
      setSelectedCategoriesId(newSelectedCategories);
      localStorage.setItem("selectedCategories", JSON.stringify(newSelectedCategories));
    } else {
      const updatedCategories = selectedCategoriesId.filter((categoryId) => categoryId !== id);
      setSelectedCategoriesId(updatedCategories);
      localStorage.setItem("selectedCategories", JSON.stringify(updatedCategories));
    }
  };
  useEffect(() => {
    const storedCategories = localStorage.getItem("selectedCategories");
    if (storedCategories) {
      setSelectedCategoriesId(JSON.parse(storedCategories));
    }
  }, []);
  

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  const today = new Date().toISOString().split("T")[0];

  const publish_DateFilteredBlogs = blogs.filter(
    (blog) => blog.publish_date <= today
  );

  return (
    <>
      <Header />
      <main className="home-page-main-container">
        <div className="blog-image-title">
          <h1>ბლოგი</h1>
          <img src={blogImage} alt="blogImage" />
        </div>
        <div className="category-container">
          {categories.map((category) => {
            return (
              <button
                style={{
                  color: category.text_color,
                  backgroundColor: category.background_color,
                  border: selectedCategoriesId.includes(category.id)
                    ? "1px solid #000000"
                    : "none",
                }}
                onClick={() => handleCategoryClick(category.id)}
                key={category.id}
              >
                {category.title}
              </button>
            );
          })}
        </div>
        <div className="card-contaner">
          {(selectedCategoriesId.length === 0
            ? publish_DateFilteredBlogs
            : publish_DateFilteredBlogs.filter((blog) =>
                blog.categories.some((category) =>
                  selectedCategoriesId.includes(category.id)
                )
              )
          ).map((blog) => {
            return (
              <div className="blog-card-container">
                <div>
                  <img className="blog-card-main-image" src={blog.image} />
                  <span className="blog-author">{blog.author}</span>
                  <h5 className="blog-date">{blog.publish_date}</h5>
                  <p className="blog-title">{blog.title}</p>
                  <div className="blog-categories-cont">
                    <div className="blog-categories-cont">
                      <div className="blog-categories-cont">
                        {blog.categories.map((category) => {
                          // const categoryStyles = mapCategoryToColors(
                          //   categoryTitle,
                          //   categories
                          // );
                          return (
                            <button
                              key={category.id}
                              style={{
                                color: category.text_color,
                                backgroundColor: category.background_color,
                              }}
                              className="blog-category-btn"
                            >
                              {category.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="blog-description">
                    {blog.description.split(" ").slice(0, 10).join(" ")}...
                  </p>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  className="view-all-contaner"
                >
                  <Link
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    to={`blog/${blog.id}`}
                  >
                    <button className="view-all-btn">სრულად ნახვა</button>
                  </Link>
                  <img src={arrow} alt="arrow" />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
