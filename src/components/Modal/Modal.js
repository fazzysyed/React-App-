import React from "react";
import "./Modal.css";
import icon from "../../Assets/remove.png";
import { useMediaQuery } from "react-responsive";

export default function Modal({ onClose, pin, setPin, cross, pinError }) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  return (
    <div class="modal" id="modal">
      <div
        style={{
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          padding: 5,
          alignItems: "center",
        }}
      >
        <h2>Enter Pin</h2>

        <img onClick={cross} src={icon} style={{ height: 30, width: 30 }} />
      </div>

      {/* <div class="content">{this.props.children}</div> */}
      <div class="actions">
        <input
          placeholder="Enter Pin"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
          }}
          maxLength={6}
          style={{
            background: "#FFFFFF",
            border: "0px solid #ccc",
            fontSize: 18,

            height: 50,
            width: "100%",
          }}
        />
        <p
          style={{
            textAlign: "start",
            marginLeft: 37,
            color: "red",
          }}
        >
          {pinError}
        </p>
        <button class="toggle-button" onClick={onClose}>
          Verify
        </button>
      </div>
    </div>
  );
}
