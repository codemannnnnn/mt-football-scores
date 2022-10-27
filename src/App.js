import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

function App() {
  //state
  const [data, setData] = useState([]);

  const url = "https://scorestream.com/api";

  const params = {
    method: "games.search",
    params: {
      isExploreSearch: true,
      aboveConfidenceGrade: 30,
      afterDateTime: "2022-10-15 21:57:26",
      beforeDateTime: "2022-10-23 21:57:26",
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
      console.log(finArr);
      console.log(finArr.length);
      setData(finArr);
    };

    call();
  }, []);

  console.log({ data });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
