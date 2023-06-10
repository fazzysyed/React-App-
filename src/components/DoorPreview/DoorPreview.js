import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import ce from "google-map-react";
import uuid from "react-uuid";

import Pin from "../../Assets/pin.png";
import { GenerateDay } from "../../Helper/GenerateDay";
import { calculateDistance } from "../../Helper/CalculateDistance";
// import "./DoorPreview.css";
import axios from "axios";
import { makeRoomId } from "../../Helper/RoomId";
import Modal from "../Modal/Modal";
import Links from "../Links/Links";

import Contact from "../Contact/Contact";
import Chat from "../Chat/Chat";

import toast, { Toaster } from "react-hot-toast";
import "./DoorPreview.css";
import Gif from "../../Assets/loading.gif";
import { useMediaQuery } from "react-responsive";
import Popup from "../PopUp/Popup";
import { Confirm } from "../PopUp/Popup";
import { convertTime12To24 } from "../../Helper/TimeConverter";
import { useParams } from "react-router-dom";
import dist from "react-hot-toast";

const AnyReactComponent = ({ text }) => (
  <img src={Pin} className="marker-pin" style={{ height: 50, width: 50 }} />
);

const DoorPreview = () => {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isBigScreen = useMediaQuery({ minWidth: 1824 });
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  const isRetina = useMediaQuery({ minResolution: "2dppx" });

  //   const params = {
  //     id: "doorid=1166",
  //   };

  const params = useParams();

  const [center, setCenter] = useState({
    lat: 33.697831,
    lng: 73.0491165,
  });
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [list1, setList1] = useState([]);
  const [enterPin, setEnterPin] = useState(false);
  const [pinError, setPinError] = useState("");

  const [item, setItem] = useState(null);
  const [view, setView] = useState(false);

  const [loadingAppoint, setLoadingAppoint] = useState(false);
  const [showAppointmentButton, setShowAppointmentButton] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [linktoShare, setLinktoShare] = useState("");

  const [pin, setPin] = useState("");
  const [chatEnable, setChatEnable] = useState(false);
  const [deviceUUID, setDeviceUUID] = useState("");
  const [contact, setContact] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [user, setUser] = useState("");
  const [messageForDoor, setMessageForDoor] = useState(
    "You have reached an exclusive door."
  );

  useEffect(() => {
    setModalShow(true);
  }, []);

  function convertMetersToKilometers(meters) {
    const kilometers = meters / 1000;
    return kilometers;
  }
  const calculateDistanceHandler = (coordinate1, coordinate2) => {
    const earthRadius = 6371; // Earth's radius in kilometers
    const lat1 = toRadians(coordinate1.latitude);
    const lon1 = toRadians(coordinate1.longitude);
    const lat2 = toRadians(coordinate2.latitude);
    const lon2 = toRadians(coordinate2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    console.log(distance * 1000, "firstStatement");
    return distance.toFixed(2) * 1000;
  };

  const toRadians = (angle) => {
    return angle * (Math.PI / 180);
  };
  const getDoor = async (lat, long) => {
    // setItem(null);
    var time = new Date();

    if (params) {
      setLoading(true);

      console.log(params);
      if (params.id.includes("alarm")) {
        var config = {
          method: "post",
          url: `${"https://doorbellap.com/api/"}get/single/emergency/door`,

          data: {
            door_id: params.id.split("=")[1],
            // door_id: "737",
            user_id: localStorage.getItem("device_uuid"),
            time: new Date().toISOString(),
            pin: null,
            isfirstTime: true,
          },
        };

        axios(config)
          .then(function (response) {
            if (response.data.meta.responseCode === 200) {
              console.log(response.data.data.latitude, "JHJHJH");

              if (response.data.data) {
                setItem(response.data.data);

                setList1([]);

                const coordinate1 = {
                  latitude: lat,
                  longitude: long,
                };
                const coordinate2 = {
                  latitude: parseFloat(response.data.data.latitude),
                  longitude: parseFloat(response.data.data.longitude),
                };

                const newDis = calculateDistanceHandler(
                  coordinate1,
                  coordinate2
                );

                setDistance(newDis);

                setView(false);
                setLoading(false);
              } else {
                setView(true);
                setLoading(false);
              }
            }
          })
          .catch(() => {
            setView(false);
            setLoading(false);
          });
      } else {
        var config = {
          method: "post",
          url: `${"https://doorbellap.com/api/"}get/single/public/door`,

          data: {
            door_id: params.id.split("=")[1],
            // door_id: "737",
            user_id: localStorage.getItem("device_uuid"),
            time: new Date().toISOString(),
            pin: null,
            isfirstTime: true,
          },
        };

        axios(config)
          .then(function (response) {
            console.log(response);
            if (response.data.meta.responseCode === 200) {
              if (response.data.data) {
                if (response.data.data[0]) {
                  setItem(response.data.data[0]);
                  let newArray = [];
                  if (response.data.data[0].doordays) {
                    response.data.data[0].doordays.map((item) => {
                      if (item.to_hour && item.from_hour) {
                        newArray.push({
                          id: item.day_id,
                          toTime: convertTime12To24(item.to_hour),
                          fromTime: convertTime12To24(item.from_hour),
                          name: GenerateDay(item.day_id).name,
                          day: GenerateDay(item.day_id).day,
                        });
                      }
                    });
                  }

                  setList1(newArray);

                  if (!response.data.data.appointment) {
                    const coordinate1 = {
                      latitude: lat,
                      longitude: long,
                    };

                    const coordinate2 = {
                      latitude: parseFloat(response.data.data[0].latitude),
                      longitude: parseFloat(response.data.data[0].longitude),
                    };

                    const newDis = calculateDistanceHandler(
                      coordinate1,
                      coordinate2
                    );
                    console.log(newDis, "EWakejlaejalkej");
                    setDistance(newDis);
                  }

                  setLoading(false);
                } else {
                  setLoading(false);

                  if (response.data.data.appointment) {
                    if (response.data.data.grant_access === "both") {
                      if (response.data.data.appointment) {
                        setShowAppointmentButton(false);
                        setShowPin(true);
                        setView(true);
                      } else {
                        setShowAppointmentButton(true);
                        setShowPin(true);
                        setView(true);
                      }
                    }
                    if (response.data.data.grant_access === "pin_only") {
                      setShowPin(true);
                      setShowAppointmentButton(false);

                      setView(true);
                    }
                    if (response.data.data.grant_access === "invitation_only") {
                      if (response.data.data.appointment) {
                        setShowAppointmentButton(false);
                        setView(true);
                      } else {
                        setShowAppointmentButton(true);
                        setView(true);
                      }
                    }
                  } else {
                    if (response.data.data.grant_access === "both") {
                      setShowAppointmentButton(true);
                      setShowPin(true);
                      setView(true);
                    }
                    if (response.data.data.grant_access === "pin_only") {
                      setShowPin(true);
                      setView(true);

                      setShowAppointmentButton(true);
                    }
                    if (response.data.data.grant_access === "invitation_only") {
                      setShowAppointmentButton(true);
                      setView(true);
                    }
                  }
                }
              }
            } else {
              setLoading(false);
              setView(true);
            }
          })
          .catch(function (error) {
            console.log(error.response);

            setMessageForDoor(error.response.data.meta.message[0]);
            setView(true);
            setLoading(false);
          });
      }
    }
  };
  const getDoorbyPin = async () => {
    setPinError("");

    var time = new Date();
    console.log(
      time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );

    // setItem(null);
    if (params) {
      setLoading(true);
      var config = {
        method: "post",
        url: `${"https://doorbellap.com/api/"}get/single/public/door`,

        data: {
          door_id: params.id.split("=")[1],
          user_id: localStorage.getItem("device_uuid"),
          time: new Date().toISOString(),
          pin: pin,
        },
      };

      axios(config)
        .then(function (response) {
          if (response.data.meta.responseCode === 200) {
            console.log(response.data.data, "JHJHJH");

            if (response.data.data) {
              if (response.data.data[0]) {
                setItem(response.data.data[0]);
                let newArray = [];
                if (response.data.data[0].doordays) {
                  response.data.data[0].doordays.map((item) => {
                    if (item.to_hour && item.from_hour) {
                      newArray.push({
                        id: item.day_id,
                        toTime: convertTime12To24(item.to_hour),
                        fromTime: convertTime12To24(item.from_hour),
                        name: GenerateDay(item.day_id).name,
                        day: GenerateDay(item.day_id).day,
                      });
                    }
                  });
                }

                setList1(newArray);

                if (response.data.data[0].latitude) {
                  const coordinate1 = {
                    latitude: center.lat,
                    longitude: center.lng,
                  };
                  const coordinate2 = {
                    latitude: parseFloat(response.data.data[0].latitude),
                    longitude: parseFloat(response.data.data[0].longitude),
                  };

                  const newDis = calculateDistanceHandler(
                    coordinate1,
                    coordinate2
                  );

                  setDistance(newDis);
                }

                setLoading(false);
                setEnterPin(false);
                setView(false);
              } else {
                setLoading(false);
                setView(true);

                if (response.data.data.grant_access === "both") {
                  setShowAppointmentButton(true);
                  setShowPin(true);
                }
                if (response.data.data.grant_access === "pin_only") {
                  setShowPin(true);
                }
                if (response.data.data.grant_access === "invitation_only") {
                  setShowAppointmentButton(true);
                }
              }
            }
          } else {
            setLoading(false);
            setView(true);
          }
        })
        .catch(function (error) {
          setView(true);
          console.log(error);
          setPinError(error.response.data.meta.message[0]);
          setLoading(false);
        });
    }
  };

  const makeAppointment = (name, email, phone, note) => {
    setLoadingAppoint(true);

    var config = {
      method: "post",
      url: "https://doorbellap.com/api/book/anonymous/appointment",
      headers: {},
      data: {
        door_id: params.id.split("=")[1],
        device_id: localStorage.getItem("device_uuid"),
        name: name,
        email: email,
        mobile: phone,
        note: note,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        toast("Request submitted.");

        // setLoadingAppoint(false);
      })
      .catch(function (error) {
        toast(error.response.data.meta.message[0]);

        // setLoadingAppoint(false);
      });
  };
  useEffect(() => {
    console.log(params, "Hello");
    navigator.geolocation.getCurrentPosition(
      function (position) {
        if (position.coords) {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          getDoor(position.coords.latitude, position.coords.longitude);
        }
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
      },
      (error) => {
        if (error.PERMISSION_DENIED) {
          console.log("No Access");
          setMessageForDoor("Please allow the location permission.");

          setView(true);
        }
      }
    );
  }, []);

  const [zoom, setZoom] = useState(18);
  return (
    <React.Fragment>
      {loading ? (
        <div className="loader">
          <img className="loading-icon" src={Gif} />
        </div>
      ) : (
        <>
          {view && (
            <div style={{ flex: 1, justifyContent: "center" }}>
              <p
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginTop: 50,

                  marginHorizontal: 30,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {messageForDoor}
              </p>

              {showPin ? (
                <p
                  onClick={() => {
                    setEnterPin(true);
                  }}
                  style={{
                    padding: 10,
                    alignSelf: "center",
                    textDecorationColor: "#1A98D5",
                    textDecorationLine: "underline",
                    color: "#1A98D5",
                    fontFamily: "Poppins-Regular",
                    cursor: "pointer",
                  }}
                >
                  Enter Pin
                </p>
              ) : null}

              {showAppointmentButton ? (
                <button
                  className="appointment-button"
                  onClick={() => {
                    setView(false);
                    setContact(true);
                  }}
                  // onPress={() => {
                  //   if (user) {
                  //     makeAppointment();
                  //   } else {
                  //     navigation.navigate("AnnonymousAppointment", {
                  //       door_id: door_id,
                  //     });
                  //   }
                  // }}
                >
                  Appointment/Admission Request
                </button>
              ) : null}
            </div>
          )}

          {enterPin && (
            <div style={{ textAlign: "center" }}>
              <Modal
                cross={() => setEnterPin(false)}
                pin={pin}
                setPin={(e) => setPin(e)}
                onClose={() => getDoorbyPin()}
              />
            </div>
          )}
          {/* {view && (
            <Contact
              handleSubmit={(name, email, phone) => {
                makeAppointment(name, email, phone);
              }}
            />
          )} */}

          {contact && (
            <Contact
              handleSubmit={(name, email, phone, note) =>
                makeAppointment(name, email, phone, note)
              }
            />
          )}
          {item && (
            <>
              {chatEnable ? (
                <Chat
                  forward={() => {
                    setChatEnable(true);
                  }}
                  back={() => {
                    setChatEnable(false);
                  }}
                  doorToSave={item}
                  door_id={params.id.split("=")[1]}
                  device_id={localStorage.getItem("device_uuid")}
                  url={
                    list1.length === 0
                      ? "emergency/door/for/chat"
                      : "get/details/for/chat"
                  }
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <header className="App-header">
                    <img
                      src={item.image}
                      style={
                        isTabletOrMobile
                          ? {
                              height: 75,
                              width: 75,
                              borderRadius: 75 / 2,
                              margin: 10,
                            }
                          : {
                              height: 180,
                              width: 180,
                              borderRadius: 10,
                              margin: 10,
                            }
                      }
                    />

                    <div>
                      <h1
                        style={{ fontSize: isTabletOrMobile ? "1.2em" : "2em" }}
                      >
                        {item.name} @ {item.owner}
                      </h1>
                      <span
                        style={{ fontSize: isTabletOrMobile ? "0.7em" : "2em" }}
                      >
                        {item.location}
                      </span>
                    </div>
                    <div></div>
                  </header>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      //   height: "20vh",
                      height: 700,
                      marginTop: 10,
                      width: "100%",
                    }}
                  >
                    {isTabletOrMobile ? (
                      <div>
                        <div
                          style={{
                            display: "flex",

                            margin: 5,
                          }}
                        >
                          {list1.slice(0, 4).map((item) => {
                            return (
                              <div
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border: "2px solid #ccc",
                                  width: 250,
                                  borderRadius: 7,
                                  height: 50,

                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  adjustsFontSizeToFit
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {item.day}
                                </span>
                                <p
                                  style={{
                                    fontSize: 10,
                                    textAlign: "center",
                                    marginBottom: 5,
                                  }}
                                >
                                  {item.toTime}-{item.fromTime}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <div
                          style={{
                            display: "flex",

                            margin: 5,
                          }}
                        >
                          {list1.slice(4, 7).map((item) => {
                            return (
                              <div
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border: "2px solid #ccc",
                                  width: 250,
                                  borderRadius: 7,
                                  height: 50,

                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  adjustsFontSizeToFit
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {item.day}
                                </span>
                                <p
                                  style={{
                                    fontSize: 10,
                                    textAlign: "center",
                                    marginBottom: 5,
                                  }}
                                >
                                  {item.toTime}-{item.fromTime}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          margin: 10,
                        }}
                      >
                        {list1.map((item) => {
                          return (
                            <div
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                border: "2px solid #ccc",
                                width: 150,
                                borderRadius: 7,
                                height: 60,

                                flexDirection: "column",
                              }}
                            >
                              <span
                                adjustsFontSizeToFit
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {item.day}
                              </span>
                              <p
                                style={{
                                  fontSize: 10,
                                  textAlign: "center",
                                  marginBottom: 5,
                                }}
                              >
                                {item.toTime}-{item.fromTime}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* <div
                        onClick={() => {
                          if (distance <= Number(item.zone_of_operation)) {
                            setChatEnable(true);
                          } else {
                            window.open(
                              "https://maps.google.com?q=" +
                                item.latitude +
                                "," +
                                item.longitude
                            );
                          }
                          // Confirm.open({
                          //   title: "Alert",
                          //   message:
                          //     "Are you sure you wish the background color?",
                          //   onok: () => {
                          //     alert("Fazzy");
                          //   },
                          // });
                        }}
                        style={{
                          backgroundColor: "#1a98d5",
                          display: "flex",
                          cursor: "pointer",

                          width: "70%",
                          alignSelf: "center",

                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <h2 style={{ color: "#FFFFFF" }}>
                          {distance <= Number(item.zone_of_operation)
                            ? "Ring"
                            : "Directions"}
                        </h2>
                      </div> */}
                      <div
                        style={{
                          backgroundColor:
                            distance <= Number(item.zone_of_operation)
                              ? "#05BF05"
                              : "red",

                          display: "flex",

                          borderRadius: 5,

                          width: "80%",
                          alignSelf: "center",

                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <h4 style={{ color: "#FFFFFF" }}>
                          {distance <= Number(item.zone_of_operation)
                            ? "You're in the zone"
                            : "You're not in the zone"}
                        </h4>
                        <h3
                          onClick={() => {
                            if (distance <= Number(item.zone_of_operation)) {
                              setChatEnable(true);
                            } else {
                              window.open(
                                "https://maps.google.com?q=" +
                                  item.latitude +
                                  "," +
                                  item.longitude
                              );
                            }
                          }}
                          style={{
                            marginLeft: 10,
                            color: "#FFFFFF",
                            border: "2px solid #fff",
                            width: 100,
                            borderRadius: 5,
                            padding: 10,
                            cursor: "pointer",
                          }}
                        >
                          {" "}
                          {distance <= Number(item.zone_of_operation)
                            ? "Ring"
                            : "Directions"}
                        </h3>

                        {distance <= Number(item.zone_of_operation) && (
                          <h3
                            onClick={() => {
                              window.open(
                                "https://maps.google.com?q=" +
                                  item.latitude +
                                  "," +
                                  item.longitude
                              );
                            }}
                            style={{
                              marginLeft: 10,
                              background: "#50C878",
                              color: "#FFFFFF",
                              border: "2px solid #50C878",
                              width: 100,
                              borderRadius: 5,
                              padding: 10,
                              cursor: "pointer",
                            }}
                          >
                            Directions
                          </h3>
                        )}
                      </div>
                    </div>

                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: "AIzaSyAzf7KnzVx3iLASRh25OP_bYgTpUD-dIW8",
                        language: "en",
                      }}
                      defaultCenter={center}
                      center={center}
                      defaultZoom={zoom}
                      esIWantToUseGoogleMapApiInternals
                    >
                      <AnyReactComponent lat={center.lat} lng={center.lng} />
                    </GoogleMapReact>
                  </div>
                  {/* <Popup
                    title={"You dont have the permission to edit this survey"}
                    cancel="cancel"
                    accept={"Okay"}
                  /> */}
                </div>
              )}
            </>
          )}
        </>
      )}
      {modalShow && (
        <Links
          door={params.id}
          ring={() => {
            setChatEnable(true);
            setModalShow(false);
          }}
          inZone={
            item && distance <= Number(item.zone_of_operation) ? true : false
          }
          onClose={() => setModalShow(false)}
        ></Links>
      )}
    </React.Fragment>
  );
};
export default DoorPreview;
