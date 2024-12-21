import axios from "axios";
import React, { useEffect, useState } from "react";

const DisplayCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/fromData");
        setData(response.data); // Assuming response is an array of objects
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to extract the last value from nested objects
  const extractLastValue = (value) => {
    if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value);
      const lastKey = keys[keys.length - 1];
      return value[lastKey];
    }
    return value; // Return value itself if not an object
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          {/* Render Image */}
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt="Vehicle"
              className="w-full h-48 object-cover"
            />
          )}

          <div className="p-6">
            {Object.entries(item)
              .filter(
                ([key]) => key !== "_id" && key !== "file" && key !== "imageUrl"
              ) // Exclude unwanted keys
              .map(([key, value], index) => (
                <p
                  key={index}
                  className="text-gray-800 bg-blue-50 py-2 px-3 rounded-md shadow-inner mb-2 text-sm font-medium"
                >
                  {key === "carname" || key === "model" || key === "brand"
                    ? `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}` // Capitalize the key
                    : extractLastValue(value) || "N/A"}
                </p>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayCard;
