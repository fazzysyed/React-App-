import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
} from "react";
import "./Chat.css";

import firebase from "firebase";
import uuid from "react-uuid";
import Back from "../../Assets/left-arrow.png";
import avatarPic from "../../Assets/avatar.svg";
import send from "../../Assets/send.png";
import Audio from "../../Assets/audio-permium-icon.png";
import Video from "../../Assets/video-premium-icon.png";
import Blocked from "../../Assets/ad.png";

import axios from "axios";
import { sendMessageNotification } from "../../Helper/SendNotification";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import Gif from "../../Assets/loading.gif";

// const db = app.firestore();

function App({ back, door_id, device_id, url, forward }) {
  const [fetchedUser, setFetchedUser] = useState(null);
  const [allFcms, setAllFcms] = useState([]);
  const [people, setPeople] = useState([]);

  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");

  const [ringedOnStartUp, setRingOnStartUp] = useState(false);

  // const [chatId, setChatId] = useState(`5000`);
  const [chatId, setChatId] = useState(`${door_id}-${device_id}`);

  const [doorToSave, setDoorToSave] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAllDetails = (loading) => {
    setLoading(loading);

    setTimeout(() => {
      let config2 = {
        method: "post",
        url: `${"https://doorbellap.com/api/"}${url}`,
        data: {
          door_id: door_id,
          visitor_id: device_id,
        },
      };
      axios(config2)
        .then((response) => {
          if (response.data.meta.responseCode === 200) {
            console.log(response.data.data, "chat data");
            setDoorToSave(response.data.data.Door_Detail);
            setFetchedUser(response.data.data.Owner);
            setIsBlocked(response.data.data.is_blocked);

            console.log(response.data.data.Hosts, "TEstingFazzy");

            let newArray = [];

            if (response.data.data.Hosts.length > 0) {
              for (let item of response.data.data.Hosts) {
                newArray.push({
                  user_id: item.id,
                  type: item.type === "host" ? "Host" : "Visitor",
                  notifications: true,

                  is_seen: false,
                });
              }
            }

            console.log(newArray, "FAZZZZZZZ", response.data.data.Hosts);

            console.log(newArray, "GLGLGLGL");
            setPeople(newArray);

            setAllFcms(response.data.data.Hosts);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e.response, "HGeajlfkajfaklfjalfjkalfkjaa");

          setLoading(false);

          if (
            e.response.data.meta.message[0] ===
            "The selected door id is invalid."
          ) {
          }
        });
    }, 2000);
  };

  useEffect(() => {
    getAllDetails(true);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => getAllDetails(false), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useLayoutEffect(() => {
    const messageRef = db
      .collection("chatrooms")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc");

    messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSanp) => {
        const data = docSanp.data();
        // console.log(data, 'HHHHHH');
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });
  }, []);

  const getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    return today;
  };

  const onSend = async (messageArray) => {
    forward();
    if (isBlocked === false) {
      const mymsg = {
        _id: uuid(),
        text: formValue,
        user: {
          _id: device_id,
          avatar:
            "https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg",
          name: device_id,
        },
        sentBy: device_id,
        sentTo: chatId,
        createdAt: new Date(),
      };
      // setMessages(previousMessages => {
      //   console.log(previousMessages, 'Previous');
      //   GiftedChat.append(previousMessages, mymsg);
      // });
      let docid = chatId;
      db.collection("chatrooms")
        .doc(chatId)
        .collection("messages")
        .add({
          ...mymsg,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          db.collection("chatrooms")
            .doc(chatId)
            .get()
            .then((snap) => {
              if (!snap.exists) {
                let data = url.includes("emergency")
                  ? {
                      users: people,
                      user_id: device_id,
                      door_id: docid,
                      doorname: doorToSave.name,
                      real_door: doorToSave.id,
                      screentoNavigate: "AlarmVisitorChat",
                      doorimage: doorToSave.image,
                      last_message: {
                        ...mymsg,
                      },
                      createdAt: new Date().getTime(),
                    }
                  : {
                      users: people,
                      user_id: device_id,
                      door_id: docid,
                      doorname: doorToSave.name,
                      real_door: doorToSave.id,
                      screentoNavigate: "RealDoorVisitorChat",
                      doorimage: doorToSave.image,
                      last_message: {
                        ...mymsg,
                      },
                      createdAt: new Date().getTime(),
                    };
                db.collection("chatrooms").doc(`${chatId}`).set(data);
              } else {
                let newArray = [...snap.data().users];
                if (newArray.length != allFcms.length) {
                  db.collection("chatrooms").doc(docid).update({
                    users: people,
                  });
                } else {
                  let updatedArray = [];

                  newArray.map((item) => {
                    updatedArray.push({
                      ...item,
                      is_seen: false,
                    });
                  });
                  db.collection("chatrooms")
                    .doc(docid)
                    .update({
                      users: updatedArray,
                      last_message: {
                        ...mymsg,
                      },
                      createdAt: new Date().getTime(),
                    });
                }
              }
            });
          if (allFcms.length) {
            let usersFromChat = [];
            db.collection("chatrooms")
              .doc(docid)
              .get()
              .then((snap) => {
                if (snap.exists) {
                  let newArray = [...snap.data().users];
                  console.log(newArray, "JHJHJHJUTUTUTTUTURYRYRY");
                  for (let newItem of newArray) {
                    if (newItem.notifications) {
                      console.log(newItem, "KKKKFKFKFKFKFK");
                      let newPerson = allFcms.find(
                        (x) => x.id === newItem.user_id
                      );
                      console.log(newPerson, "NEw Person");
                      usersFromChat.push(newPerson);
                    }
                  }
                  if (usersFromChat.length) {
                    console.log(usersFromChat, "USRFROMCHAT");
                    for (let i of usersFromChat) {
                      sendMessageNotification(
                        i.fcm,
                        device_id,
                        formValue,
                        device_id,
                        door_id,
                        chatId,
                        undefined,
                        doorToSave.name
                      );
                    }
                  }
                } else {
                  allFcms.map((item) => {
                    sendMessageNotification(
                      item.fcm,
                      device_id,
                      formValue,
                      device_id,
                      door_id,
                      chatId,
                      undefined,
                      doorToSave.name
                    );
                  });
                }
              });
            setFormValue("");
          }
          // console.log(item, 'Token fazzy');
        });
    } else {
      // alert("The Door Owner blocked you!");
      toast(
        `Sorry you can't continue the chat the ${doorToSave.name} owner blocked you!`
      );
    }
  };

  function myDate() {
    let day_id = "";
    var a = new Date();
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    var r = weekdays[a.getDay()];

    if (r === "Sunday") {
      return (day_id = "3");
    }
    if (r === "Monday") {
      return (day_id = "4");
    }
    if (r === "Tuesday") {
      return (day_id = "5");
    }
    if (r === "Wednesday") {
      return (day_id = "6");
    }
    if (r === "Thursday") {
      return (day_id = "7");
    }
    if (r === "Friday") {
      return (day_id = "1");
    }
    if (r === "Saturday") {
      return (day_id = "2");
    }
  }

  const ringOnStartupHandler = () => {
    if (url.includes("emergency")) {
      var config = {
        method: "post",
        url: `https://doorbellap.com/api/save/notifications/for/emergency/door`,
        headers: {},
        data: {
          guest_id: "",
          door_id: doorToSave.id,
          dev_converted_id: device_id.substring(0, 6),
          dev_org_id: device_id,
          user_id: doorToSave.user_id,
          chat_id: chatId,
          screen: "AlarmVisitorChat",
          door_name:
            doorToSave.name === "Panic Button" ? "Panic Button" : "Alarm",
        },
      };
      axios(config)
        .then((response) => {
          console.log(response, "ihponeajfhakjh", doorToSave);
          let myMessage = {
            _id: uuid(),
            text: doorToSave.message,
            createdAt: new Date(),

            user: {
              _id: doorToSave.user_id,
              name: doorToSave.name,
              avatar: doorToSave.image,
            },
          };

          let docid = chatId;

          console.log(myMessage, "Kingetttewtwt");
          db.collection("chatrooms")

            .doc(docid)
            .collection("messages")
            .add({
              ...myMessage,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              db.collection("chatrooms")
                .doc(docid)
                .get()
                .then((snap) => {
                  if (!snap.exists) {
                    db.collection("chatrooms")
                      .doc(docid)
                      .set({
                        users: people,
                        user_id: device_id,
                        door_id: docid,
                        doorname: doorToSave.name,
                        screentoNavigate: "AlarmVisitorChat",

                        real_door: doorToSave.id,

                        doorimage: doorToSave.image,

                        last_message: {
                          ...myMessage,
                        },
                        createdAt: new Date().getTime(),
                      });
                  } else {
                    let newArray = [...snap.data().users];

                    if (newArray.length != allFcms.length) {
                      db.collection("chatrooms").doc(docid).update({
                        users: people,
                      });
                    } else {
                      let updatedArray = [];

                      newArray.map((item) => {
                        updatedArray.push({
                          ...item,
                          is_seen: false,
                        });
                      });
                      db.collection("chatrooms")
                        .doc(docid)
                        .update({
                          users: updatedArray,
                          last_message: {
                            ...myMessage,
                          },
                          createdAt: new Date().getTime(),
                        });
                    }
                  }
                });
            })
            .catch((e) => {
              console.log(e, "BODY");
            });
        })
        .then(() => {
          toast("Host Phone is Ringing.");
        })
        .catch((error) => {});
    } else {
      let time = new Date();

      let dayToday = myDate();

      let data = [...doorToSave.doordays];
      let newDay = data.filter((e) => e.day_id === dayToday);
      let today = getCurrentDate();

      console.log(today);
      let date = new Date(`${today} ${newDay[0].to_hour}`);
      let date2 = new Date(`${today} ${newDay[0].from_hour}`);
      let currentTime = new Date().getTime();

      var startTime = new Date(date).getTime();
      var endTime = new Date(date2).getTime();
      if (currentTime >= startTime && currentTime <= endTime) {
        console.log("Between");

        var config = {
          method: "post",
          url: `https://doorbellap.com/api/send/notification`,
          headers: {},
          data: {
            guest_id: "",
            door_id: doorToSave.id,
            dev_converted_id: device_id.substring(0, 6),
            dev_org_id: device_id,
            chat_id: chatId,
            screen: "RealDoorVisitorChat",
          },
        };
        axios(config)
          .then((response) => {
            console.log(
              {
                _id: uuid(),
                text: doorToSave.msg_in_operational_houres,
                createdAt: new Date(),

                user: {
                  _id: doorToSave.user_id,
                  name: doorToSave.name,
                  avatar: doorToSave.image,
                },
              },
              "eteterwrqrqrqrq",
              response,
              uuid()
            );

            let myMessage = {
              _id: uuid(),
              text: doorToSave.msg_in_operational_houres,
              createdAt: new Date(),

              user: {
                _id: doorToSave.user_id,
                name: doorToSave.name,
                avatar: doorToSave.image,
              },
            };

            let docid = chatId;

            console.log(myMessage, "Kingetttewtwt");
            db.collection("chatrooms")

              .doc(docid)
              .collection("messages")
              .add({
                ...myMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                db.collection("chatrooms")
                  .doc(docid)
                  .get()
                  .then((snap) => {
                    if (!snap.exists) {
                      db.collection("chatrooms")
                        .doc(docid)
                        .set({
                          users: people,
                          user_id: device_id,
                          door_id: docid,
                          doorname: doorToSave.name,
                          screentoNavigate: "RealDoorVisitorChat",

                          real_door: doorToSave.id,

                          doorimage: doorToSave.image,

                          last_message: {
                            ...myMessage,
                          },
                          createdAt: new Date().getTime(),
                        });
                    } else {
                      let newArray = [...snap.data().users];

                      if (newArray.length != allFcms.length) {
                        db.collection("chatrooms").doc(docid).update({
                          users: people,
                        });
                      } else {
                        let updatedArray = [];

                        newArray.map((item) => {
                          updatedArray.push({
                            ...item,
                            is_seen: false,
                          });
                        });
                        db.collection("chatrooms")
                          .doc(docid)
                          .update({
                            users: updatedArray,
                            last_message: {
                              ...myMessage,
                            },
                            createdAt: new Date().getTime(),
                          });
                      }
                    }
                  });
              })
              .catch((e) => {
                console.log(e, "BODY");
              });
            toast("Host Phone is Ringing.");
          })
          .catch(function (error) {
            // console.log(error);

            toast(error.response.data.meta.message[0]);
            console.log(
              error.response.data.meta.message[0],
              "fkajfhakjsfhajksfh"
            );
          });
      } else {
        toast(doorToSave.msg_in_off_houres);
      }
    }
  };

  useEffect(() => {
    if (ringedOnStartUp === false) {
      if (doorToSave && fetchedUser && !isBlocked && people.length) {
        ringOnStartupHandler();
        setRingOnStartUp(true);
      }
    }
  }, [doorToSave, people]);

  return (
    <React.Fragment>
      {loading ? (
        <div className="loader">
          <img className="loading-icon" src={Gif} />
        </div>
      ) : (
        <div className="AppChat">
          <header>
            <img src={Back} onClick={back} style={{ cursor: "pointer" }} />
            {/* <img src={doorToSave.image} /> */}
            <h1 className="appTitle">{doorToSave.name} 💬</h1>
          </header>

          <section>
            <main>
              {messages.length && isBlocked === false ? (
                messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg}
                    device_id={device_id}
                  />
                ))
              ) : (
                <div />
              )}

              {isBlocked && (
                <div style={{ marginTop: 100 }}>
                  <img src={Blocked} style={{ height: 70, width: 70 }} />

                  <p
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins-SemiBold",
                      color: "#000",
                      marginTop: 10,

                      marginHorizontal: 30,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {"You have been blocked by the door owner."}
                  </p>
                </div>
              )}

              {isBlocked === false && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,

                    // position: "absolute",
                    // left: 0,
                    // right: 0,

                    // top: 100,
                  }}
                >
                  <div
                    style={{
                      height: 50,
                      fontSize: 14,
                      backgroundColor: "#1a98d5",

                      display: "flex",
                      cursor: "pointer",
                      padding: 10,
                      width: "22%",
                      alignSelf: "center",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",

                      // marginTop: 23,
                    }}
                    onClick={() => {
                      ringOnStartupHandler();
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Ring Again
                    </span>
                  </div>

                  <div style={{}}>
                    <div>
                      <img
                        onClick={() => {
                          toast(
                            "Subscription required to unlock. Subscription is only available thru the app at the moment.",
                            {
                              duration: 5000,
                            }
                          );
                        }}
                        src={Audio}
                        style={{
                          height: 60,
                          width: 60,
                          margin: 10,
                          cursor: "pointer",
                        }}
                      />
                      <img
                        onClick={() => {
                          toast(
                            "Subscription required to unlock. Subscription is only available thru the app at the moment.",
                            {
                              duration: 5000,
                            }
                          );

                          // toast((t) => (
                          //   <span>
                          //     Custom and <b>bold</b>
                          //     <button
                          //       style={{ color: "red" }}
                          //       onClick={() => toast.dismiss(t.id)}
                          //     >
                          //       Dismiss
                          //     </button>
                          //   </span>
                          // ));
                        }}
                        src={Video}
                        style={{
                          height: 60,
                          width: 60,
                          margin: 10,
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </main>

            {isBlocked === false && (
              <div style={{ display: "flex" }}>
                <input
                  className="inputChat"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="Type message"
                />

                <button onClick={() => onSend()} disabled={!formValue}>
                  <img src={send} style={{ height: 20, width: 20 }} />
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </React.Fragment>
  );
}

function ChatMessage(props) {
  const { text, user, sentBy } = props.message;

  console.log(props.message, "Single message");

  const messageClass = sentBy === props.device_id ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={user.avatar} alt="" />
      <p className="text messageBubble">
        <b className="nameTag">{`${user.name} Says:`}</b>
        <br /> {text}
      </p>
    </div>
  );
}

export default App;
