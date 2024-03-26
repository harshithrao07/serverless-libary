import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateClient } from "aws-amplify/api";
import { uploadData, getProperties } from "aws-amplify/storage";
import { Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createBook } from "../api/mutations";
import config from "../amplifyconfiguration.json";
import { useNavigate } from "react-router-dom";
import AllOrdersAdmin from "../components/AllOrdersAdmin";
import AllUsersAdmin from "../components/AllUsersAdmin";

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config;

const Admin = () => {
  const [image, setImage] = useState(null);
  const [pdf, setPDF] = useState(null);
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState({
    title: "",
    description: "",
    image: "",
    pdf: "",
    author: "",
    price: "",
  });

  useEffect(() => {
    if (
      localStorage.getItem("username") == null &&
      localStorage.getItem("userId") == null &&
      localStorage.getItem("cartId") == null
    ) {
      navigate("/auth?message=You have to login first");
    }
  }, []);

  const client = generateClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!bookDetails.title || !bookDetails.price) return;
      const res = await client.graphql({
        query: createBook,
        variables: { input: bookDetails },
      });
      console.log(res);
      setBookDetails({
        title: "",
        description: "",
        image: "",
        author: "",
        price: "",
        pdf: "",
      });
      setImage("");
      setPDF("");
      alert("You have successfully uploaded a book.");
    } catch (err) {
      console.log("error creating todo:", err);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const extension = file.name.split(".")[1];
    const name = file.name.split(".")[0];
    const key = `images/${uuidv4()}${name}.${extension}`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;

    try {
      // Upload the file to s3 with public access level.
      async function toUpload() {
        const res = await uploadData({
          key: key,
          data: file,
          options: {
            accessLevel: "public",
          },
        }).result;
      }

      await toUpload();

      // Retrieve the uploaded file to display
      const image = await getProperties({
        key: key,
        options: { accessLevel: "public" },
      });

      setImage(url);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setBookDetails((prevBookDetails) => ({
      ...prevBookDetails,
      image: image,
      pdf: pdf,
    }));
  }, [image, pdf]);

  const handlePdfUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const extension = file.name.split(".")[1];
    const name = file.name.split(".")[0];
    const key = `pdf/${uuidv4()}${name}.${extension}`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;

    console.log("PDF URL:", url); // Debugging statement

    try {
      // Upload the file to S3 with public access level.
      await uploadData({
        key: key,
        data: file,
        options: {
          accessLevel: "public",
        },
      });

      console.log("PDF uploaded successfully"); // Debugging statement

      // Set the PDF URL in the state
      setPDF(url);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="admin-wrapper mb-5 my-12 lg:my-20 lg:px-20">
      <section>
        <header className="form-header">
          <span className="text-4xl font-bold text-primary-200 mt-3">
            Add New Book
          </span>
        </header>
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <div className="form-image">
            {image ? (
              <img className="image-preview" src={image} alt="The Image" />
            ) : (
              <div className="flex flex-col">
                <label>Add the preview of the book</label>
                <input
                  type="file"
                  accept="image/jpg"
                  onChange={(e) => handleImageUpload(e)}
                />
              </div>
            )}
          </div>

          <div className="form-fields">
            <div className="title-form">
              <p>
                <label htmlFor="title">Title</label>
              </p>
              <p>
                <input
                  name="email"
                  type="title"
                  value={bookDetails.title}
                  placeholder="Type the title"
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, title: e.target.value })
                  }
                  required
                />
              </p>
            </div>
            <div className="description-form">
              <p>
                <label htmlFor="description">Description</label>
              </p>
              <p>
                <textarea
                  name="description"
                  type="text"
                  rows="8"
                  value={bookDetails.description}
                  placeholder="Type the description of the book"
                  onChange={(e) =>
                    setBookDetails({
                      ...bookDetails,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </p>
            </div>
            <div className="author-form">
              <p>
                <label htmlFor="author">Author</label>
              </p>
              <p>
                <input
                  name="author"
                  type="text"
                  placeholder="Type the author's name"
                  value={bookDetails.author}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, author: e.target.value })
                  }
                  required
                />
              </p>
            </div>
            <div className="price-form">
              <p>
                <label htmlFor="price">Price (₹)</label>
                <input
                  name="price"
                  type="text"
                  value={bookDetails.price}
                  placeholder="What is the Price of the book (INR)"
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, price: e.target.value })
                  }
                  required
                />
              </p>
            </div>
            <div className="featured-form">
              <p>
                <label>Featured?</label>
                <input
                  type="checkbox"
                  className="featured-checkbox"
                  checked={bookDetails.featured}
                  onChange={() =>
                    setBookDetails({
                      ...bookDetails,
                      featured: !bookDetails.featured,
                    })
                  }
                />
              </p>
            </div>
            <div className="flex flex-col my-3">
              <label>Add the PDF of the book</label>
              <input type="file" onChange={(e) => handlePdfUpload(e)} />
            </div>
            <div className="submit-form my-3">
              <Button className="btn" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </section>
      <AllUsersAdmin />
      <AllOrdersAdmin />
    </section>
  );
};

export default Admin;
