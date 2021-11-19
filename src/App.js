import { useState, useEffect, useRef } from "react";

let textObj = {
  initialText: "fff",
  curChar: "",
  curIndex: 0,
  lastKey: "",
  isError: false,
};

let initialStats = {
  typeCount: 0,
  correctTypes: 0,
  wrongTypes: 0,
  beginTime: null,
  typeSpeed: 0,
  accuracy: 100,
};

function App() {
  const [text, _setText] = useState(textObj);
  const [statistics, _setStatistics] = useState(initialStats);

  const textRef = useRef(text);
  const statsRef = useRef(statistics);
  const setText = (data) => {
    textRef.current = data;
    _setText(data);
  };
  const setStatistics = (data) => {
    statsRef.current = data;
    _setStatistics(data);
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
      if (!e.repeat && e.key.match(/[\w\s.,-]/) && e.key.length === 1) {
        const textData = textRef.current;
        if (statsRef.current.typeCount === 0) {
          setStatistics({ ...statsRef.current, beginTime: Date.now() });
        }
        setText({ ...textData, lastKey: e.key });
        if (textData.curChar === e.key) {
          setText({
            ...textData,
            curChar: textData.initialText[textData.curIndex + 1],
            curIndex: textData.curIndex + 1,
            isError: false,
          });
          setStatistics({
            ...statsRef.current,
            typeCount: statsRef.current.typeCount + 1,
            correctTypes: statsRef.current.correctTypes + 1,
          });
        } else {
          setText({ ...textData, isError: true });
          setStatistics({
            ...statsRef.current,
            typeCount: statsRef.current.typeCount + 1,
            wrongTypes: statsRef.current.wrongTypes + 1,
          });
        }
      }
    });

    setInterval(() => {
      setStatistics({
        ...statsRef.current,
        typeSpeed: statsRef.current.typeCount
          ? Math.round(
              statsRef.current.typeCount /
                ((Date.now() - statsRef.current.beginTime) / 60000)
            )
          : 0,
        accuracy: statsRef.current.typeCount
          ? Math.round(
              (statsRef.current.correctTypes / statsRef.current.typeCount) * 100
            )
          : 100,
      });
    }, 1000);
  }, []);

  return (
    <div className="app">
      <div className="app__wrapper">
        <div className="app__text text">
          {text.initialText.split("").map((char, index) => {
            if (index < text.curIndex) {
              return (
                <span key={index} className="text__char text__char_done">
                  {char}
                </span>
              );
            } else if (index === text.curIndex) {
              return (
                <span
                  key={index}
                  className={
                    text.isError
                      ? "text__char text__char_wrong"
                      : "text__char text__char_current"
                  }
                >
                  {char}
                </span>
              );
            }
            return (
              <span key={index} className="text__char">
                {char}
              </span>
            );
          })}
        </div>

        <div className="app__statistics statistics">
          <div className="statistics__speed">
            <div className="statistics__title">Скорость</div>
            <div className="statistics__text">
              {statistics.typeSpeed + " зн/мин"}
            </div>
          </div>
          <div className="statistics__accuracy">
            <div className="statistics__title">Точность</div>
            <div className="statistics__text">{statistics.accuracy + "%"}</div>
          </div>
          <button className="statistics__reset">Заново</button>
        </div>
      </div>
    </div>
  );
}

export default App;
