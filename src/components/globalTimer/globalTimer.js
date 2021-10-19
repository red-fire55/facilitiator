import React, { Component, useEffect, useState } from "react";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BottomNavigation from "@mui/material/BottomNavigation";
import AccessIcon from "@mui/icons-material/AccessTime";
import db from "../../database/index";

let fromTime = new Date(0, 0, 0, 0, 0, 0, 0);
let globalTimer = (props) => {
  const [timer, setTimer] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    let timerId;
    let setTime = () => {
      setTimer(0);
      setMinutes(minutes + 1);
      if (minutes >= 59) {
        setMinutes(0);
        setHours(hours + 1);
      }
    };
    if (props.start == true) {
      timerId = setInterval(
        () => (timer <= 59 ? setTimer(timer + 1) : setTime()),
        1000
      );
    } else {
      clearInterval(timerId);

      let session_id = localStorage.getItem("sessionId");
      db.sessions
        .where("id")
        .equals(Number(session_id))
        .modify({
          globale_time: {
            seconeds: timer,
            minutes: minutes,
            hours: hours,
          },
        });
    }

    return () => clearInterval(timerId);
  });

  return (
    <div>
      <BottomNavigation
        color="primary"
        style={{ position: "absolute", top: "90%" }}
      >
        <AccessIcon style={{ marginRight: "10px", marginTop: "15px" }} />
        <h3>
          {hours}:{minutes}:{timer}
        </h3>
      </BottomNavigation>
    </div>
  );
};

export default globalTimer;
