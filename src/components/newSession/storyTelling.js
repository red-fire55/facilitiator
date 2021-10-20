import React, { Component, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import HeadsetMic from "@mui/icons-material/HeadsetMic";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import Pause from "@mui/icons-material/Pause";
import SnackBar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import download from "downloadjs";
import { ipcRenderer } from "electron";
import db from "../../database/index";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

let storyTelling = (props) => {
  //data declaration
  let [sec, setSec] = useState(2);
  let [clicked, setClicked] = useState(false);
  let [record, setRecord] = useState(false);
  let [record2, setRecord2] = useState(false);
  let [recordeStarted, setRS] = useState(false);
  let [recordeStarted2, setRS2] = useState(false);
  let [audio, setAudio] = useState(null);
  let [aTSec, setATSec] = useState(0);
  let [aTMin, setATMin] = useState(0);
  let [recordTime, setRecordTime] = useState(null);
  let [openSnack, setSnack] = useState(false);
  let rows = [
    createData(159, 6.0),
    createData(237, 9.0),
    createData(262, 16.0),
  ];

  function createData(list1, list2) {
    return { list1, list2 };
  }

  // react hook to set times
  useEffect(() => {
    //recording timer
    if (recordeStarted == true || recordeStarted2 == true) {
      let startTimer = () => {
        setATSec(aTSec + 1);
        if (aTSec >= 58) {
          setATSec((aTSec = 0));
          setATMin(aTMin + 1);
        }
      };
      let init = setInterval(() => startTimer(), 1000);
      return () => clearInterval(init);
    } else {
      // setATSec((aTSec = 0));
      // setATMin((aTMin = 0));
    }

    //img timer
    if (clicked == true) {
      let hide = () => {
        let fImg = document.getElementsByClassName("fImg");
        let fRecorder = document.getElementsByClassName("fRecorder");
        fImg[0].setAttribute("hidden", true);
        fRecorder[0].removeAttribute("hidden");
        ipcRenderer.send("hide-img", {
          img: null,
        });
      };

      let init = setInterval(() => (sec >= 1 ? setSec(sec - 1) : hide()), 1000);
      return () => clearInterval(init);
    } else {
      let fRecorder = document.getElementsByClassName("fRecorder");
      fRecorder[0].setAttribute("hidden", true);
    }
  });

  //start recording method
  let start = () => {
    setRS((recordeStarted = true));
    setRecord((record = RecordState.START));
    let canvasAudio = document.getElementsByClassName(
      "audio-react-recorder__canvas"
    );
    canvasAudio[0].removeAttribute("hidden");
  };

  //start recording method
  let start2 = () => {
    setRS2((recordeStarted2 = true));
    setRecord2((record2 = RecordState.START));
    let canvasAudio = document.getElementsByClassName(
      "audio-react-recorder__canvas"
    );
    canvasAudio[1].removeAttribute("hidden");
  };

  //stop recording method
  let stop = () => {
    setRS((recordeStarted = false));
    setRecord((record = RecordState.STOP));
    let canvasAudio = document.getElementsByClassName(
      "audio-react-recorder__canvas"
    );

    canvasAudio[0].setAttribute("hidden", true);
  };
  //stop recording method
  let stop2 = () => {
    setRS2((recordeStarted2 = false));
    setRecord2((record2 = RecordState.STOP));
    let canvasAudio = document.getElementsByClassName(
      "audio-react-recorder__canvas"
    );

    canvasAudio[1].setAttribute("hidden", true);
  };

  //listener on the finish of the record
  let blobToFile = (theBlob, fileName) => {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  };
  let onStop = (audioData) => {
    setClicked((clicked = false));
    //old code to download and save the record
    // download(audioData.blob, "record1.wav");
    //new code
    const reader = new FileReader();

    reader.onload = (event) => {
      localStorage.setItem("record1", event.target.result);
    };

    reader.readAsDataURL(audioData.blob);
    let fRecorder = document.getElementsByClassName("fRecorder");
    let stage2End = document.getElementsByClassName("stage2End");
    fRecorder[0].setAttribute("hidden", true);
    stage2End[0].removeAttribute("hidden");
  };

  //listener on the finish of the record
  let onStop2 = (audioData) => {
    setClicked((clicked = false));
    let stage3 = document.getElementsByClassName("stage3");
    let stage3End = document.getElementsByClassName("stage3End");

    const reader = new FileReader();

    reader.onload = (event) => {
      localStorage.setItem("record2", event.target.result);
    };

    reader.readAsDataURL(audioData.blob);
    stage3[0].setAttribute("hidden", true);
    stage3[0].style.display = "none";
    stage3End[0].removeAttribute("hidden");
  };
  //show image method
  let showImg = () => {
    let x = document.getElementsByClassName("startText"),
      startBtn = document.getElementsByClassName("startButton"),
      fImg = document.getElementsByClassName("fImg");

    x[0].setAttribute("hidden", true);
    startBtn[0].setAttribute("hidden", true);
    fImg[0].removeAttribute("hidden");
    setClicked((clicked = true));
    ipcRenderer.send("show-img", {
      img: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
    });
  };

  //open snackbar method
  let openSnackbar = () => {
    ipcRenderer.send("open-msg", {
      msg: "very good",
    });
  };

  //close snackbar method
  let closeSnackbar = () => {
    setSnack((openSnack = false));
  };

  //turn blobs back
  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
  }

  //initiate phase 3
  let initStage3 = () => {
    openSnackbar();
    let record = dataURItoBlob(localStorage.getItem("record1"));
    let stage2End = document.getElementsByClassName("stage2End");
    let stage3Start = document.getElementsByClassName("stage3Start");
    let pageTitle = document.getElementsByClassName("pageTitle");
    stage2End[0].setAttribute("hidden", true);
    stage3Start[0].removeAttribute("hidden");
    pageTitle[0].innerText = "Reading";

    // save first record time into seconeds and minutes
    db.sessions
      .add({
        grecord_time1: {
          seconeds: aTSec,
          minutes: aTMin,
        },
      })
      .then((res) => {
        setATSec((aTSec = 0));
        setATMin((aTMin = 0));
        localStorage.setItem("sessionId", res);
        download(record, `first record session Number ${res}`);
      });
  };

  let startStage3 = () => {
    let stage3Start = document.getElementsByClassName("stage3Start");
    let stage3 = document.getElementsByClassName("stage3");
    stage3Start[0].setAttribute("hidden", true);
    stage3[0].removeAttribute("hidden");
    stage3[0].style.display = "flex";
    start2();
    ipcRenderer.send("show-words", rows);
  };

  // end session
  let endSession = () => {
    ipcRenderer.send("hide-words");
    let stage3End = document.getElementsByClassName("stage3End");
    let sessionEnd = document.getElementsByClassName("endSession");
    stage3End[0].setAttribute("hidden", true);
    sessionEnd[0].removeAttribute("hidden");

    let session_id = localStorage.getItem("sessionId");
    let record = dataURItoBlob(localStorage.getItem("record2"));
    db.sessions
      .where("id")
      .equals(Number(session_id))
      .modify({
        record_time2: {
          seconeds: aTSec,
          minutes: aTMin,
        },
      })
      .then(() => {
        setATSec((aTSec = 0));
        setATMin((aTMin = 0));
        download(record, `seconed record session number ${session_id}`);
      });
  };

  //finish session
  let finish = () => {
    let session_id = localStorage.getItem("sessionId");
    let data;
    db.sessions
      .where("id")
      .equals(Number(session_id))
      .each((res) => {
        data = res;
        ipcRenderer.send("save", {
          session: session_id,
          info: data,
        });
      });
    props.onStart(false);

    setTimeout(() => {
      props.history.go("/");
    }, 3000);
  };

  //render method
  return (
    <div
      style={{
        width: "75vw",
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "center",
      }}
    >
      <h3
        style={{
          alignSelf: "center",
          textAlign: "center",

          position: "relative",
        }}
        className="pageTitle"
      >
        Story Telling
      </h3>
      <h4
        style={{
          alignSelf: "center",
          marginTop: "1rem",
          width: "100%",
        }}
        className="startText"
      >
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </h4>

      <h3
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        className="startButton"
      >
        <Button
          variant="contained"
          style={{
            width: "10vw",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={showImg}
        >
          Start
        </Button>
      </h3>
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="fImg"
      >
        <img
          src="https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
          alt=""
          style={{
            width: "60vw",
            height: "60vh",
          }}
        />
        <h3>{sec}</h3>
      </div>
      <h2
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="fRecorder"
      >
        <Fab
          color={recordeStarted == false ? "primary" : "grey"}
          aria-label="start Recording"
          onClick={recordeStarted == false ? start : stop}
        >
          {recordeStarted == false ? <HeadsetMic /> : <Pause />}
        </Fab>
        <AudioReactRecorder
          canvasWidth="100"
          canvasHeight="50"
          state={record}
          onStop={onStop}
        />
        <span>{`${aTMin} : ${aTSec}`}</span>
      </h2>
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="stage2End"
      >
        <h2
          style={{ textAlign: "center", width: "100%" }}
        >{`${aTMin} : ${aTSec}`}</h2>
        <Button
          variant="contained"
          style={{ marginTop: "10rem" }}
          onClick={initStage3}
        >
          save and proceed
        </Button>
      </div>
      <SnackBar
        open={openSnack}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message="Very Good"
      />
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="stage3Start"
      >
        <h4
          style={{
            alignSelf: "center",
            marginTop: "1rem",
            width: "100%",
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </h4>
        <Button
          variant="contained"
          style={{ marginTop: "10rem" }}
          onClick={startStage3}
        >
          start
        </Button>
      </div>
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="stage3"
      >
        <div style={{ width: "50%", alignItems: "center" }}>
          <h3
            style={{ width: "100%", textAlign: "center" }}
          >{`${aTMin} : ${aTSec}`}</h3>
          <Fab
            color={recordeStarted2 == false ? "primary" : "grey"}
            aria-label="start Recording"
            onClick={recordeStarted2 == false ? start2 : stop2}
          >
            {recordeStarted2 == false ? <HeadsetMic /> : <Pause />}
          </Fab>
          <AudioReactRecorder
            canvasWidth="100"
            canvasHeight="50"
            state={record2}
            onStop={onStop2}
          />
          <h3>stop recording</h3>
        </div>
        <TableContainer component={Paper} style={{ maxWidth: "50%" }}>
          <Table sx={{ maxWidth: "100%" }} aria-label="caption table">
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.list1}>
                  <TableCell align="center">{row.list1}</TableCell>
                  <TableCell align="center">{row.list2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="stage3End"
      >
        <h3
          style={{ width: "100%", textAlign: "center" }}
        >{`${aTMin} : ${aTSec}`}</h3>
        <h2 style={{ width: "100%", textAlign: "center" }}>recording Time</h2>
        <Button variant="contained" onClick={endSession}>
          save and proceed
        </Button>
      </div>
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          marginTop: "5rem",
          position: "relative",
        }}
        hidden
        className="endSession"
      >
        <h2 style={{ width: "100%", textAlign: "center" }}>All Done</h2>
        <Button variant="contained" onClick={finish}>
          Finish Session
        </Button>
      </div>
    </div>
  );
};

export default storyTelling;
