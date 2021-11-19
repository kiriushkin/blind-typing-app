import { useState, useEffect, useRef } from "react";

let initialText = {
  initialText: "",
  curChar: "",
  curIndex: 0,
  lastKey: "",
  isError: false,
  isWrongKeyboard: false,
};

let initialStats = {
  typeCount: 0,
  correctTypes: 0,
  wrongTypes: 0,
  beginTime: null,
  typeSpeed: 0,
  accuracy: 100,
  isComplete: false,
};

function App() {
  const [text, _setText] = useState(initialText);
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
  // Reset button handler
  const resetHandler = () => {
    setText(initialText);
    setStatistics(initialStats);
    //Get bacon ipsum
    (async () => {
      let resp = await fetch(
        "https://baconipsum.com/api/?type=meat-and-filler&sentences=2"
      );
      resp = await resp.json();
      setText({
        ...textRef.current,
        initialText: resp.reduce((a, b) => a + b).replace(/\s\s/g, " "),
        curChar: resp[0][0],
      });
    })();
  };

  useEffect(() => {
    //Get bacon ipsum
    (async () => {
      let resp = await fetch(
        "https://baconipsum.com/api/?type=meat-and-filler&sentences=2"
      );
      resp = await resp.json();
      setText({
        ...textRef.current,
        initialText: resp.reduce((a, b) => a + b).replace(/\s\s/g, " "),
        curChar: resp[0][0],
      });
    })();
    // Add keydown listener with handler
    document.addEventListener("keydown", (e) => {
      const textData = textRef.current;
      if (statsRef.current.isComplete) {
        return;
      }
      if (!e.repeat && e.key.match(/[\w\s.,-]/) && e.key.length === 1) {
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
            isWrongKeyboard: false,
          });
          setStatistics({
            ...statsRef.current,
            typeCount: statsRef.current.typeCount + 1,
            correctTypes: statsRef.current.correctTypes + 1,
          });
          if (textData.initialText.length - 1 === textData.curIndex) {
            setStatistics({ ...statsRef.current, isComplete: true });
          }
        } else {
          setText({ ...textData, isError: true, isWrongKeyboard: false });
          setStatistics({
            ...statsRef.current,
            typeCount: statsRef.current.typeCount + 1,
            wrongTypes: statsRef.current.wrongTypes + 1,
          });
        }
      }
      // Wrong language
      if (!e.repeat && e.key.match(/[а-яА-я]/) && e.key.length === 1) {
        setText({ ...textData, isWrongKeyboard: true });
      }
    });
    // Set interval update statistics
    setInterval(() => {
      if (statsRef.current.isComplete) {
        return;
      }
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
      {statistics.isComplete ? (
        <div className="app__wrapper app__wrapper_vertical">
          <div className="app__container result">
            <div className="result__speed">
              <div className="result__title">Скорость</div>
              <div className="result__text">
                {statistics.typeSpeed + " зн/мин"}
              </div>
            </div>
            <div className="result__accuracy">
              <div className="result__title">Точность</div>
              <div className="result__text">{statistics.accuracy + "%"}</div>
            </div>
            <div className="result__total">
              <div className="result__title">Нажатий</div>
              <div className="result__text">{statistics.typeCount}</div>
            </div>
            <div className="result__correct">
              <div className="result__title">Верных</div>
              <div className="result__text">{statistics.correctTypes}</div>
            </div>
            <div className="result__wrong">
              <div className="result__title">Неверных</div>
              <div className="result__text">{statistics.wrongTypes}</div>
            </div>
          </div>
          <button
            className="app__reset"
            onClick={resetHandler}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            Заново
          </button>
        </div>
      ) : (
        <div className="app__wrapper app__wrapper_horizontal">
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
              <div className="statistics__text">
                {statistics.accuracy + "%"}
              </div>
            </div>
            <button
              className="statistics__reset"
              onClick={resetHandler}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              Заново
            </button>
          </div>
        </div>
      )}

      <div className="error-message">
        {text.isWrongKeyboard ? "Смените раскладку клавиатуры!" : ""}
      </div>
    </div>
  );
}

export default App;
