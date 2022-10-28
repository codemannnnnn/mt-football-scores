import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import masterDataList from "./updateData.json";

//css
import "./main.css";

function App() {
  //state
  const [data, setData] = useState([]);
  const [classAA, setClassAA] = useState([]);
  const [classA, setClassA] = useState([]);
  const [classB, setClassB] = useState([]);
  const [classC, setClassC] = useState([]);

  //loading state
  const [loading, setLoading] = useState(true);

  const url = "https://scorestream.com/api";

  const date = new Date();
  const afterDate = moment(date).subtract(7, "d").format();
  const beforeDate = moment(date).format();

  const params = {
    method: "games.search",
    params: {
      isExploreSearch: true,
      aboveConfidenceGrade: 30,
      afterDateTime: afterDate,
      beforeDateTime: beforeDate,
      sportNames: ["football"],
      squadIds: [1010],
      country: "US",
      state: "MT",
      count: 100,
      offset: 0,
      apiKey: "a20bd983-0147-437a-ab6d-49afeb883d33",
    },
  };

  useEffect(() => {
    const call = async () => {
      let res = await axios.post(url, params);

      let data = res.data.result.collections;

      let gameCollection = data.gameCollection.list;
      let teamCollection = data.teamCollection.list;

      var arr = [];

      gameCollection.map((e) => {
        var recentDate = moment(e.startDateTime).unix();
        var oldDateComparer = moment(new Date()).subtract(6, "d").unix();

        if (recentDate > oldDateComparer) {
          let homeTeam = e.homeTeamId;
          let homeTeamScore = e.lastScore.homeTeamScore;
          let awayTeam = e.awayTeamId;
          let awayTeamScore = e.lastScore.awayTeamScore;

          var newRes = {
            gameId: e.gameId,

            homeTeamId: homeTeam,
            awayTeamId: awayTeam,
            score: {
              homeTeam: homeTeamScore,
              awayTeam: awayTeamScore,
            },
          };
          arr.push(newRes);
        }
      });

      const homeArr = [];
      arr.map((e) => {
        teamCollection.map((j) => {
          if (j.teamId == e.homeTeamId) {
            homeArr.push({
              ...e,
              homeTeamName: j.teamName,
              homeTeamMascot: j.mascot1,
            });
          }
          if (j.teamId == e.awayTeamId) {
            homeArr.push({
              ...e,
              awayTeamName: j.teamName,
              awayTeamMascot: j.mascot1,
            });
          }
        });
      });

      var count = 0;
      let arr3 = [];
      for (let i = 0; i < homeArr.length; i++) {
        arr3.push({ ...homeArr[count], ...homeArr[count + 1] });

        count = count + 2;
      }

      var arr4 = [];

      for (let i = 0; i < gameCollection.length; i++) {
        arr4.push(arr3[i]);
      }

      //compare the master data list against the pulled in game data
      //match them, add the class to the object, then return.
      var finArr = [];
      for (let i = 0; i < masterDataList.length; i++) {
        for (let j = 0; j < arr4.length; j++) {
          if (masterDataList[i].teamId == arr4[j].homeTeamId) {
            var obj = {
              ...arr4[j],
              class: masterDataList[i].class,
            };
            finArr.push(obj);
          }
        }
      }
      // console.log(finArr);
      // console.log(finArr.length);
      const classAAarr = [];
      const classAarr = [];
      const classBarr = [];
      const classCarr = [];

      finArr.map((e) => {
        if (e.class == "AA") {
          classAAarr.push(e);
        }
        if (e.class == "A") {
          classAarr.push(e);
        }
        if (e.class == "B") {
          classBarr.push(e);
        }
        if (e.class == "C") {
          classCarr.push(e);
        }
      });

      setData(finArr);
      setClassAA(classAAarr);
      setClassA(classAarr);
      setClassB(classBarr);
      setClassC(classCarr);
      setLoading(false);
    };

    call();
  }, []);

  return (
    <div className="App">
      <h1>Montana High School Football</h1>
      <div className="home-away">
        <h1>Home</h1>
        <h1>Away</h1>
      </div>
      <div>
        <div className="class-aa">
          <h1>Class AA</h1>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            classAA.map((e, idx) => {
              return (
                <div key={idx} className="game-box">
                  <div className="team-box">
                    <div className="team-class">{e.homeTeamName}</div>
                    <div className="score-class">{e.score.homeTeam}</div>
                  </div>
                  <div className="team-box">
                    <div className="score-class">{e.score.awayTeam}</div>
                    <div className="team-class">{e.awayTeamName}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="home-away">
          <h1>Home</h1>
          <h1>Away</h1>
        </div>
        <div className="class-a">
          <h1>Class A</h1>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            classA.map((e, idx) => {
              return (
                <div key={idx} className="game-box class-a">
                  <div className="team-box">
                    <div className="team-class">{e.homeTeamName}</div>
                    <span className="score-class">{e.score.homeTeam}</span>
                  </div>
                  <div className="team-box">
                    <div className="score-class">{e.score.awayTeam}</div>
                    <div className="team-class"> {e.awayTeamName}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="home-away">
          <h1>Home</h1>
          <h1>Away</h1>
        </div>
        <div className="class-b">
          <h1>Class B</h1>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            classB.map((e, idx) => {
              return (
                <div key={idx} className="game-box class-b">
                  <div className="team-box">
                    <div className="team-class">{e.homeTeamName}</div>
                    <span className="score-class">{e.score.homeTeam}</span>
                  </div>
                  <div className="team-box">
                    <div className="score-class">{e.score.awayTeam}</div>
                    <div className="team-class"> {e.awayTeamName}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="home-away">
          <h1>Home</h1>
          <h1>Away</h1>
        </div>
        <div className="class-c">
          <h1>Class C</h1>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            classC.map((e, idx) => {
              return (
                <div key={idx} className="game-box class-c">
                  <div className="team-box">
                    <div className="team-class">{e.homeTeamName}</div>
                    <span className="score-class">{e.score.homeTeam}</span>
                  </div>
                  <div className="team-box">
                    <div className="score-class">{e.score.awayTeam}</div>
                    <div className="team-class">{e.awayTeamName}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
