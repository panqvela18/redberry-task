import axios from "axios";
const token =
"4614b9bb546a70d4b1c6561260ef92216d76706de0eb845a23f0d61fd50c652a";

export default axios.create({
  baseURL: "https://api.blog.redberryinternship.ge/api",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
});