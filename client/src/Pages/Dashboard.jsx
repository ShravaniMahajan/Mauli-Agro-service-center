import React, { useEffect, useState } from "react";
import API from "../api/axios";


function Dashboard() {

  const [user, setUser] = useState(null);


  useEffect(() => {


    const token = localStorage.getItem("token");


    API.get("/users/profile", {

      headers: {

        Authorization: `Bearer ${token}`

      }

    })

    .then((res) => {

      console.log("User Data:", res.data);

      setUser(res.data.user);

    })


    .catch((err) => {

      console.log(
        "Error:",
        err.response?.data || err.message
      );

    });


  }, []);



  return (

    <div>

      <h1>
        Dashboard Page
      </h1>


      {
        user ? (

          <div>

            <p>
              Username: {user.username}
            </p>


            <p>
              Email: {user.email}
            </p>


          </div>

        )

        :

        (

          <p>
            Loading...
          </p>

        )

      }


    </div>

  );

}


export default Dashboard;