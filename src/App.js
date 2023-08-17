import logo from "./logo.svg";
import "./App.css";
import uuid from "react-uuid";

import { useEffect, useState } from "react";
import DoorPreview from "./components/DoorPreview/DoorPreview";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Gif from "../src/Assets/loading.gif";

import { HashRouter, Route } from "react-router-dom";

function App() {
  const [center, setCenter] = useState(null);
  const [status, setStatus] = useState(true);

  useEffect(() => {
    let device_uuid = localStorage.getItem("device_uuid");
    console.log(device_uuid, "afhkalfhakfhakjf");
    if (device_uuid === null) {
      let newDev = uuid().replace(/-/g, "");
      var config = {
        method: "post",
        url: "https://doorbellap.com/api/save/anonymous/user",
        headers: {},
        data: {
          id: newDev,
          fcm_token: newDev,

          device_type: "Web",
        },
      };

      axios(config)
        .then(function (response) {
          localStorage.setItem("device_uuid", newDev);
          setStatus(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      var config = {
        method: "post",
        url: "https://doorbellap.com/api/save/anonymous/user",
        headers: {},
        data: {
          id: device_uuid,
          fcm_token: device_uuid,
          device_type: "Web",
        },
      };

      axios(config)
        .then(function (response) {
          localStorage.setItem("device_uuid", device_uuid);
          setStatus(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="App">
      <div>
        <Toaster />
      </div>

      {status ? (
        <div className="loader">
          <img className="loading-icon" src={Gif} />
        </div>
      ) : (
        <HashRouter>
          <Route exact path="/:id" component={DoorPreview} />
        </HashRouter>
      )}
    </div>
  );
}

export default App;
