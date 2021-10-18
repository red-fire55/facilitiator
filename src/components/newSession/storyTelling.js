import React, { Component, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import HeadsetMic from "@mui/icons-material/HeadsetMic";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import Pause from "@mui/icons-material/Pause";
import download from "downloadjs"

let storyTelling = (props) => {
  let [sec, setSec] = useState(15);
  let [clicked, setClicked] = useState(false);
  let [record, setRecord] = useState(false);
  let [recordeStarted, setRS] = useState(false);
  let [audio, setAudio] = useState(null);

  function usePageViews() {
    let location = useLocation();
  }

  useEffect(() => {
    if (clicked == true) {
      let hide = () => {
        let fImg = document.getElementsByClassName("fImg");
        let fRecorder = document.getElementsByClassName("fRecorder");
        fImg[0].setAttribute("hidden", true);
        fRecorder[0].removeAttribute("hidden");
      };

      let init = setInterval(() => (sec >= 1 ? setSec(sec - 1) : hide()), 1000);
      return () => clearInterval(init);
    }
  });

  let start = () => {
    setRS((recordeStarted = true));
    setRecord((record = RecordState.START));
    let canvasAudio = document.getElementsByClassName(
      "audio-react-recorder__canvas"
    );
    canvasAudio[0].removeAttribute("hidden");
  };

  let stop = () => {
    setRS((recordeStarted = false));
    setRecord((record = RecordState.STOP));
    let canvasAudio = document.getElementsByClassName(
      "audio-react-recorder__canvas"
    );
    canvasAudio[0].setAttribute("hidden", true);
  };
  let onStop = (audioData) => {
    setAudio((audio = audioData.blob));
    console.log("audioData", audioData);
    download(audioData.blob)
  };

  let showImg = () => {
    let x = document.getElementsByClassName("startText"),
      startBtn = document.getElementsByClassName("startButton"),
      fImg = document.getElementsByClassName("fImg");

    x[0].setAttribute("hidden", true);
    startBtn[0].setAttribute("hidden", true);
    fImg[0].removeAttribute("hidden");
    setClicked((clicked = true));
  };

  return (
    <div
      style={{
        width: "90vw",
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
      <h2
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
      </h2>
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
        <audio src={audio != null? audio : ""}></audio>
      </h2>
    </div>
  );
};

export default storyTelling;
