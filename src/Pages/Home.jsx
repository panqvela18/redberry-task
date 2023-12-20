import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/Home.css";
import blogImage from "../assets/Blog-1024x355 1.png";
import api from "../Api/GetData";
import arrow from "../assets/Arrow 1.svg";
import { blogs } from "../Components/Data";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

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

  const mapCategoryToColors = (categoryTitle, categories) => {
    const matchingCategory = categories.find(
      (category) => category.title === categoryTitle
    );
    return matchingCategory
      ? {
          color: matchingCategory.text_color,
          backgroundColor: matchingCategory.background_color,
        }
      : {};
  };
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
                }}
                key={category.id}
              >
                {category.title}
              </button>
            );
          })}
        </div>
        <div className="card-contaner">
          {blogs.map((blog) => {
            return (
              <div className="blog-card-container">
                <img src={blog.img} />
                <span className="blog-author">{blog.author}</span>
                <h5 className="blog-date">{blog.date}</h5>
                <p className="blog-title">{blog.title}</p>
                <div className="blog-categories-cont">
                  <div className="blog-categories-cont">
                    <div className="blog-categories-cont">
                      {blog.categories.map((categoryTitle) => {
                        const categoryStyles = mapCategoryToColors(
                          categoryTitle,
                          categories
                        );
                        return (
                          <button
                            key={categoryTitle}
                            style={categoryStyles}
                            className="blog-category-btn"
                          >
                            {categoryTitle}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <p className="blog-description">{blog.description}</p>
                <div className="view-all-contaner">
                  <button className="view-all-btn">სრულად ნახვა</button>
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
