import React from "react";
import "./Links.css";
import Logo from "../../Assets/doorbelllogo.png";
import Ring from "../../Assets/ringnotification.png";

const Links = (props) => {
  return (
    <div className="links">
      <div className="links-content">
        <span className="close-icon" onClick={props.onClose}>
          &times;
        </span>
        <div className="logo-container">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="text-container">
          <h2>
            Don't be left behind, you too can have your own virtual door and
            more!
          </h2>
          <p>
            For many more functions, better performance, effective request
            tracking, and a more reliable experience, we recommend downloading
            the app.
          </p>
        </div>
        <div className="links-container">
          <ul>
            <li>
              <a href="#">Download App</a>
            </li>
            <li>
              <a
                onClick={() => {
                  window.location.href = `https://doorbellap.com/DoorBellWebsite/#/tutorials?${props.door}`;
                }}
                href="#"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  window.location.href = `https://doorbellap.com/DoorBellWebsite/#/help?${props.door}`;
                }}
                href="#"
              >
                Help
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  window.location.href = `https://doorbellap.com/DoorBellWebsite/#/about?${props.door}`;
                }}
                href="#"
              >
                About
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  window.location.href = `https://doorbellap.com/DoorBellWebsite/#/terms?${props.door}`;
                }}
                href="#"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  window.location.href = `https://doorbellap.com/DoorBellWebsite/#/privacy-policy?${props.door}`;
                }}
                href="#"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {props.inZone && (
          <button onClick={props.ring} class="floating-button">
            <h3>Ring</h3>
          </button>
        )}
      </div>
    </div>
  );
};

export default Links;
