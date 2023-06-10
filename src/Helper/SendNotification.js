import axios from "axios";

export const sendMessageNotification = (
  fcm,
  title,
  message,
  userid,
  doorid,
  chatgroupid,
  emergency,
  doorname
) => {
  console.log(doorid, "DoorId");
  let data = {
    to: fcm,
    notification: {
      title: title,
      body: message,
    },
    content_available: true,
    priority: "high",
    data: {
      user_id: userid,
      door_id: doorid,
      chatgroupid: chatgroupid,
      emergency: emergency,
      doorname: doorname,
    },
  };
  var config = {
    method: "post",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization:
        "Bearer AAAAtfwUgQ4:APA91bGzot7B2woEOVqZgl4akhd21nOzG17c3b-YQb732jq1_HMFZJmba-r7Px1r4XFqHhA-8dHyuH0e-kgSxh2XXi0B7PDs6TH_Wv1nux7mjFFDVaimXRWKXYNqexMnb6NsAzWZUWO2",
      "Content-Type": " application/json",
    },
    data: JSON.stringify(data),
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
