import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Dashboard = () => {
  const [formFields, setFields] = useState([]);
  const [formValues, setFormValues] = useState(
    formFields.reduce((acc, form) => {
      acc[form._id] = form.childFields.reduce((childAcc, child) => {
        if (child.type === "file") {
          childAcc[child.name] = null;
        } else {
          childAcc[child.name] = "";
        }
        return childAcc;
      }, {});
      return acc;
    }, {})
  );

  const { user } = useContext(AuthContext);
  const [signInUser, setSignInUser] = useState({});

  const getFields = async () => {
    const res = await fetch("http://localhost:3000/fields");
    const data = await res.json();
    return data;
  };

  const { data: Fields = [], refetch } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });
  useEffect(() => {
    if (Fields.length > 0) {
      setFields(Fields);
    }
  }, [Fields]);

  useEffect(() => {
    const getUser = async () => {
      const resp = await fetch(`http://localhost:3000/user/${user?.email}`);
      const data = await resp.json();
      setSignInUser(data);
    };
    getUser();
  }, [user]);

  const handleFileChange = (e) => {
    setFormValues({
      ...formValues,
      file: e.target.files[0],
    });
  };

  // Remove a field
  const handleRemove = async (id) => {
    const res = await fetch(`http://localhost:3000/fields/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.deletedCount === 1) {
      refetch();
    }
  };
  const handleInputChange = (formId, fieldName, value, isFile = false) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [formId]: {
        ...prevValues[formId],
        [fieldName]: isFile ? value : value,
      },
    }));
  };
  //first from create
  const handleSubmitForCreate = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const newField = {
      id: Date.now(),
      name,
      childFields: [],
    };
    const res = await fetch("http://localhost:3000/fields", {
      method: "POST",
      body: JSON.stringify(newField),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    if (data.insertedId) {
      refetch();
    }
    e.target.reset();
  };
  const handleDeleteChild = async (parentId, childName) => {
    try {
      const res = await fetch(
        `http://localhost:3000/fields/${parentId}/deleteChild`,
        {
          method: "DELETE",
          body: JSON.stringify({ childName }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setFields((prevFields) =>
          prevFields.map((field) =>
            field._id === parentId
              ? {
                  ...field,
                  childFields: field.childFields.filter(
                    (child) => child.name !== childName
                  ),
                }
              : field
          )
        );
      } else {
        console.error("Failed to delete child field:", data.message);
      }
    } catch (error) {
      console.error("Error while deleting child field:", error);
    }
  };

  const handleChildSubmit = async (e, id) => {
    e.preventDefault();
    const type = e.target.type.value;
    const placeholder = e.target.placeholder.value;
    const name = e.target.name.value;

    const childObj = {
      type,
      placeholder,
      name,
    };

    try {
      const res = await fetch(`http://localhost:3000/fields/${id}/addChild`, {
        method: "POST",
        body: JSON.stringify(childObj),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("Updated parent field with new child:", data);

      if (res.ok) {
        setFields((prevFields) =>
          prevFields.map((form) =>
            form.id === id
              ? { ...form, childFields: [...form.childFields, childObj] }
              : form
          )
        );
        refetch();

        e.target.reset();
      } else {
        console.error("Failed to add child field:", data.message);
      }
    } catch (error) {
      console.error("Error while adding child field:", error);
    }
  };
  const handleSubmit = async () => {
    if (!formValues.file) {
      alert("Please select a file");
      return;
    }
    console.log(formValues);
    const ImageFile = {
      image: formValues.file,
    };
    console.log(ImageFile);
    try {
      const upload_api_image_bb = `https://api.imgbb.com/1/upload?key=c023b980888fe49172794e86063e492b`;

      const res = await axios.post(upload_api_image_bb, ImageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      const data = await res.data;
      console.log(data);

      if (data.success) {
        const imageUrl = data.data.url;
        console.log(formValues);

        const allData = {
          ...formValues,
          imageUrl,
        };
        console.log(allData);

        const backendResponse = await fetch(
          `http://localhost:3000/fromData/${user?.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(allData),
          }
        );

        if (backendResponse.ok) {
          alert("Form submitted successfully with the image URL!");
        } else {
          alert("Failed to submit the form.");
        }
      } else {
        alert("Failed to upload image!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[20%] bg-sky-700 text-white flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold mb-6">
          {signInUser.role === "user" ? "User" : "Admin"} Dashboard
        </h1>
        {signInUser.role === "user" && (
          <ul className="space-y-4 text-lg">
            <li className="hover:bg-sky-800 py-2 px-4 rounded transition duration-300">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:bg-sky-800 py-2 px-4 rounded transition duration-300">
              Logout
            </li>
          </ul>
        )}
        {signInUser.role === "admin" && (
          <ul className="space-y-4 text-lg">
            <li className="hover:bg-sky-800 py-2 px-4 rounded transition duration-300">
              <Link to="/dashboard/user-submission">User Submission</Link>
            </li>
            <li className="hover:bg-sky-800 py-2 px-4 rounded transition duration-300">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:bg-sky-800 py-2 px-4 rounded transition duration-300">
              Logout
            </li>
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[80%] flex flex-col items-center py-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-8">
          Add Vehicle Information
        </h2>
        <div className="space-y-6 w-[60%] re">
          {formFields.map((form, index) => (
            <form
              onSubmit={(e) => handleChildSubmit(e, form._id)} // Pass form id
              key={index}
              className="bg-white shadow-lg rounded-lg relative p-6 flex flex-col gap-9"
            >
              <fieldset>
                <legend className="text-center text-2xl font-semibold mb-3">
                  {form.name}
                </legend>
                {form.childFields.map((child, idx) => (
                  <div
                    key={idx}
                    className="flex justify-start ml-12 gap-6 items-center mb-10"
                  >
                    <div>
                      {child.type === "file" ? (
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      ) : (
                        <input
                          type={child.type}
                          className="w-[300px] p-2"
                          placeholder={child.placeholder}
                          name={child.name}
                          value={formValues[form._id]?.[child.name] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              form._id,
                              child.name,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                    {signInUser?.role === "admin" && (
                      <div
                        onClick={() => handleDeleteChild(form._id, child.name)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        <MdDelete />
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-10 justify-center items-center">
                  {signInUser?.role === "admin" && (
                    <button
                      className=" bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
                      type="submit"
                    >
                      Add
                    </button>
                  )}
                  {signInUser?.role === "admin" && (
                    <>
                      <input
                        type="text"
                        className="w-[100px] p-1"
                        name="type"
                        placeholder="type"
                      />
                      <input
                        type="text"
                        name="placeholder"
                        placeholder="placeholder"
                        className="w-[100px] p-1"
                      />
                      <input
                        type="text"
                        name="name"
                        placeholder="name"
                        className="w-[100px] p-1"
                      />
                    </>
                  )}
                </div>
                {signInUser?.role === "admin" && (
                  <div
                    onClick={() => handleRemove(form._id)}
                    className="bg-red-500 absolute top-2 right-2 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <MdDelete />
                  </div>
                )}
              </fieldset>
            </form>
          ))}
        </div>

        {signInUser?.role === "admin" && (
          <form
            onSubmit={handleSubmitForCreate}
            className="flex gap-3 items-center justify-center mt-10"
          >
            <button
              className=" bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
              type="submit"
            >
              Add Form
            </button>
            <div>
              <input
                type="text"
                className="p-2"
                placeholder="from Name"
                name="name"
              ></input>
            </div>
          </form>
        )}

        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
