import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";
import CanvasImages from "./CanvasImages";

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [video, setVideo] = useState();
  const [frames, setFrames] = useState([]);

  const [message, setMessage] = useState("Click Start to transcode");
  const ffmpeg = createFFmpeg({
    log: true,
  });

  // useEffect(() => {
  //   const loadLibraries = async () => {
  //     await ffmpeg.load();
  //   };
  //   loadLibraries();
  // }, []);

  const extractVideoFrames = async () => {
    await ffmpeg.load();

    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));
    // Run the FFMpeg command
    // await ffmpeg.run('-i', 'test.mp4', '-vf', 'fps=1', 'frames/out-%03d.jpg');

    const fileExists = (file) => ffmpeg.FS("readdir", "/").includes(file);
    const readFile = (file) => ffmpeg.FS("readFile", file);

    let index = 1;
    const loadFrames = [];
    ffmpeg.run("-i", "test.mp4", "-vf", " fps=1/1", "out-%d.jpg").then(() => {
      // send out the remaining files
      while (fileExists(`out-${index}.jpg`)) {
        console.log("file Exists");
        console.log(`out-${index}.jpg`);
        const data = readFile(`out-${index}.jpg`);
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: "image/jpg" }),
        );
        loadFrames.push(url);
        index++;
      }
      setFrames(loadFrames);
    });

    // Read the result
    // const data = ffmpeg.FS('readFile', 'out-%03d.jpg');
    console.log("log the results");
  };

  const doTranscode = async () => {
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setMessage("Start transcoding");
    ffmpeg.FS("writeFile", "test.avi", await fetchFile("/flame.avi"));
    await ffmpeg.run("-i", "test.avi", "test.mp4");
    setMessage("Complete transcoding");
    const data = ffmpeg.FS("readFile", "test.mp4");
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })),
    );
  };
  return (
    <div className="App">
      <p />
      <video src={videoSrc} controls></video>
      <br />
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
      <div>
        <input
          type="file"
          onChange={(e) => setVideo(e.target.files?.item(0))}
        />

        <h3>Result</h3>
      </div>
      <div>
        <button onClick={extractVideoFrames}>ExtractFrame</button>
      </div>
      <div className="imagestrip">
        {frames.map((val) => {
          return <CanvasImages imageUrl={val} key={val} />;
        })}
      </div>
    </div>
  );
}

export default App;
