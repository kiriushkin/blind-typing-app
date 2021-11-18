import { useState, useEffect } from "react";

const textObj = {
  initialText: "",
  curChar: "",
  curIndex: 0,
  lastKey: "",
};

function App() {
  const [text, setText] = useState(textObj);
  const getBaconText = () => {
    fetch("https://baconipsum.com/api/?type=all-meat&paras=2")
      .then((resp) => resp.json())
      .then((resp) => {
        setText({ ...text, initialText: resp.reduce((a, b) => a + b) });
        console.log(text);
      });
  };
  const keyDownHandler = (e) => {
    if (!e.repeat) {
      console.log(text);
      setText({ ...text, lastKey: e.key });
      console.log(text);
    }
  };

  useEffect(() => {
    getBaconText();
    window.addEventListener("keydown", keyDownHandler);
  }, []);

  return (
    <div className="app">
      <div className="key-hint">{text.lastKey}</div>
      <div className="typing-text">
        {text.initialText.split("").map((char, index) => {
          if (index < text.curIndex) {
            return (
              <span
                key={index}
                className="typing-text__char typing-text__char_done"
              >
                {char}
              </span>
            );
          } else if (index === text.curIndex) {
            return (
              <span
                key={index}
                className="typing-text__char typing-text__char_current"
              >
                {char}
              </span>
            );
          }
          return (
            <span key={index} className="typing-text__char">
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default App;
