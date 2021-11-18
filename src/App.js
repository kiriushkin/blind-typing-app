import { useState, useEffect, useRef } from "react";

let textObj = {
  initialText: "fff",
  curChar: "",
  curIndex: 0,
  lastKey: "",
  isError: false,
};

function App() {
  const [text, _setText] = useState(textObj);

  const textRef = useRef(text);
  const setText = (data) => {
    textRef.current = data;
    _setText(data);
  };

  useEffect(() => {
    (async () => {
      let resp = await fetch(
        "https://baconipsum.com/api/?type=all-meat&paras=1"
      );
      resp = await resp.json();
      setText({
        ...textRef.current,
        initialText: resp.reduce((a, b) => a + b).replace(/\s\s/, " "),
        curChar: resp[0][0],
      });
    })();

    document.addEventListener("keydown", (e) => {
      if (!e.repeat && e.key.match(/[\w\s\.\,\-]/) && e.key.length == 1) {
        const data = textRef.current;
        setText({ ...data, lastKey: e.key });
        console.log(data.curChar, e.key);
        if (data.curChar == e.key) {
          setText({
            ...data,
            curChar: data.initialText[data.curIndex + 1],
            curIndex: data.curIndex + 1,
            isError: false,
          });
          console.log("correct");
        } else {
          setText({ ...data, isError: true });
        }
      }
    });
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
                className={
                  text.isError
                    ? "typing-text__char typing-text__char_wrong"
                    : "typing-text__char typing-text__char_current"
                }
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
