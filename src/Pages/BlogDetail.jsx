import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Components/Header";
import backArrow from "../assets/backArrow.svg";
import arrow from "../assets/Arrow 1.svg";
import "../Styles/Blog-Detail.css";
import api from "../Api/GetData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function BlogDetail() {
  const { id } = useParams();
  const [blogDetails, setBlogDetails] = useState(null);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const publish_DateFilteredBlogs = blogs
    .filter((blog) => blog.publish_date <= today)
    .filter((blog) => blog.id !== blogDetails.id);

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

  const fetchBlogDetail = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlogDetails(response.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  console.log(blogDetails);

  console.log(id);

  return (
    <>
      <Header />
      <main className="blog-Detail-main-container-main">
        <div className="blog-Detail-main-container">
          <Link to={"/redberry-task"}>
            <img src={backArrow} alt="arrow" />
          </Link>
          <div className="blog-detail-container">
            <img
              className="detail-page-image"
              src={blogDetails && blogDetails.image}
              alt="blog-image"
            />
            <h3>{blogDetails?.author}</h3>
            <h5>
              {blogDetails?.publish_date} • {blogDetails?.email}
            </h5>
            <h2>{blogDetails?.title}</h2>
            <div className="blog-detail-category-container">
              {blogDetails?.categories.map((category) => {
                return (
                  <button
                    key={category.id}
                    style={{
                      color: category.text_color,
                      backgroundColor: category.background_color,
                    }}
                  >
                    {category.title}
                  </button>
                );
              })}
              <p>{blogDetails?.description}</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "400px", marginTop: "92px" }}>
          <h2 className="similar-blog-title">მსგავსი სტატიები</h2>
          <Swiper
            slidesPerView={3}
            spaceBetween={32}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
          >
            {publish_DateFilteredBlogs
              .filter((blog) =>
                blogDetails?.categories.some((mainCategory) =>
                  blog.categories.some(
                    (category) => category.id === mainCategory.id
                  )
                )
              )
              .map((blog) => {
                return (
                  <SwiperSlide>
                    {
                      <div key={blog.id} className="similar-blog-container">
                        <img
                          className="similar-blog-img"
                          src={blog.image}
                          alt={blog.id}
                        />
                        <h4>{blog.author}</h4>
                        <span>{blog.publish_date}</span>
                        <h3>{blog.title}</h3>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            minHeight: "56px",
                          }}
                        >
                          {blog.categories.map((category) => {
                            return (
                              <button
                                key={category.id}
                                className="similar-categories"
                                style={{
                                  color: category.text_color,
                                  backgroundColor: category.background_color,
                                }}
                              >
                                {category.title}
                              </button>
                            );
                          })}
                        </div>
                        <p style={{minHeight:"56px"}}>
                          {blog.description.split(" ").slice(0, 10).join(" ")}
                          ...
                        </p>
                        <div className="view-all-contaner">
                          <Link
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            style={{ cursor: "pointer" }}
                            to={`/redberry-task/blog/${blog.id}`}
                          >
                            <button style={{cursor:"pointer"}} className="view-all-btn">
                              სრულად ნახვა
                            </button>
                          </Link>
                          <img src={arrow} alt="arrow" />
                        </div>
                      </div>
                    }
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </main>
      <></>
    </>
  );
}
