import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API_URL = "http://localhost:5005";

function ProfilePage() {
  const [user, setUser] = useState(false);
  const [manager, setManager] = useState(false);
  const [dogs, setDogs] = useState([]);

  const getUser = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      let response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      setUser(response.data);
      console.log(response.data);
      setDogs(response.data.ownedDogs);

      if (response.data.userType === "user") {
        setUser(true);
      } else {
        setManager(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const deleteDog = (dogId) => {
    // Send an API request to delete the dog by ID
    axios
      .delete(`${API_URL}/api/dogs/${dogId}`)
      .then(() => {
        // Remove the deleted dog from the state
        setDogs((prevDogs) => prevDogs.filter((dog) => dog._id !== dogId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Hello {user.name}, this is your profile page</h1>
      <div>
        <p>{user.userType}</p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
      <div
        className="dog-cards"
        style={{ overflowY: "scroll", maxHeight: "400px" }}
      >
        <h2>Your Dogs</h2>
        {dogs &&
          dogs.map((dog) => (
            <div key={dog._id} className="dog-card">
              <img src={dog.image} alt={dog.name} />
              <h3>Name: {dog.name}</h3>
              <h3>Age: {dog.age}</h3>
              <h3>Genre: {dog.genre}</h3>
              <h3>Size: {dog.size}</h3>
              <p>Description: {dog.description}</p>
              <Link to={`/kennels/${dog.kennel}/edit-dog/${dog._id}`}>
                <button className="edit-button">Edit</button>
              </Link>
              <button onClick={() => deleteDog(dog._id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProfilePage;
