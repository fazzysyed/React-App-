import React, { useEffect, useState } from "react";
import "./Contact.css";
const Thanks = ({ handleSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [lname, setLName] = useState("");
  const [fName, setFName] = useState("");
  const [phone, setPhone] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [note, setNote] = useState("");

  const validate = () => {
    let fnameEror = "";
    let phoneErrors = "";
    let emailerror = "";
    if (!fName) {
      fnameEror = "Name field is required";
    }
    if (!phone) {
      phoneErrors = "Phone field is required";
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || reg.test(email) === false) {
      emailerror = "Email Field is Invalid ";
    }

    if (fnameEror || phoneErrors || emailerror) {
      setFnameError(fnameEror);
      setPhoneError(phoneErrors);
      setEmailError(emailerror);
      return false;
    }
    setFnameError("");
    setPhoneError("");
    setEmailError("");
    return true;
  };

  return (
    <div className="thankyou-tick">
      <div
        style={{
          backgroundColor: "#D3D3D3",
          margin: 50,
          borderRadius: 6,
          padding: 10,
          boxShadow: "10 10",
          border: "2px solid #FFFFFF",
        }}
      >
        <div>
          <h3>Please submit appointment/admission request first</h3>
        </div>
        <div className="form-group" style={{ margin: 10 }}>
          <label
            style={{
              marginBottom: 10,
              fontSize: 14,
              display: "flex",
              alignSelf: "flex-start",
            }}
            htmlFor="name"
          >
            Name
          </label>
          <input
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
            style={{ marginBottom: 0, fontSize: 14 }}
            type="text"
            className="inputholder"
          />
          <label
            className="text-danger"
            style={{
              fontSize: 10,
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 5,
              color: "red",
            }}
            htmlFor="name"
          >
            {fnameError}
          </label>
        </div>

        <div className="form-group" style={{ margin: 10 }}>
          <label
            style={{
              marginBottom: 10,

              fontSize: 14,

              display: "flex",
              alignSelf: "flex-start",
            }}
            htmlFor="name"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: 0, fontSize: 14 }}
            type="text"
            className="inputholder"
          />
          <label
            className="text-danger"
            style={{
              fontSize: 10,
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 5,

              color: "red",
            }}
            htmlFor="name"
          >
            {emailError}
          </label>
        </div>
        <div className="form-group" style={{ margin: 10 }}>
          <label
            style={{
              marginBottom: 10,

              fontSize: 14,

              display: "flex",
              alignSelf: "flex-start",
            }}
            htmlFor="name"
          >
            Phone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginBottom: 0, fontSize: 14 }}
            type="text"
            className="inputholder"
          />

          <label
            className="text-danger"
            style={{
              fontSize: 10,
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 5,

              color: "red",
            }}
            htmlFor="name"
          >
            {phoneError}
          </label>
        </div>

        <div className="form-group" style={{ margin: 10 }}>
          <label
            style={{
              marginBottom: 10,

              fontSize: 14,

              display: "flex",
              alignSelf: "flex-start",
            }}
            htmlFor="name"
          >
            Note
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ marginBottom: 0, fontSize: 14 }}
            type="text"
            className="inputholder"
            placeholder="Optional"
          />
        </div>
        <div
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
            margin: 10,
          }}
        >
          <button
            onClick={() => {
              if (validate()) {
                handleSubmit(fName, email, phone, note);
              }
            }}
            style={{
              background: "#1a98d5",
              width: "300",
              padding: 15,
              borderRadius: 5,
              borderColor: "white",
              boxShadow: "none",
              color: "#FFFFFF",
              alignSelf: "center",
              fontSize: 13,
            }}
          >
            Appointment/Admission Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
