import {HashRouter,Link,Route,Routes} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {deepOrange, deepPurple, grey, blueGrey} from '@material-ui/core/colors'
import {Paper, Switch, Typography, createTheme, ThemeProvider, CssBaseline, Box, Avatar, Grid} from '@material-ui/core';
import Top from './Nav/Top'
import PlayerInfo from './components/PlayerInfo'
const { ipcRenderer } = window.require('electron');
let items = require('./items.json')
let champions = require('./champions.json')
let summonerSpells = require('./summonerSpells.json')
let version = require('./version.json')[0]
// const {BrowserWindow,dialog,Menu} = remote



const App = (props)=> {
    const [darkMode, setDarkMode] = useState(false);
    const [champs, setChamps] = useState([]);

    useEffect(() => {
        window.ipcRenderer.on('champs', (event, message) => {
            console.log(message)
            setChamps(message)
        })

        window.ipcRenderer.on('update', (event, message) => {
            console.log("updating champs")
            setChamps(message)
        })
    }, [])

    const theme = createTheme({
        palette: {
            // palette values for dark mode
            primary: {
                main: deepOrange[600]
            },
            divider: deepOrange[700],
            secondary: blueGrey,
            background: {
                default: blueGrey[900],
                paper: blueGrey[800],
            },
            text: {
                primary: '#fff',
                secondary: grey[500],
            },
        },
    });



  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Top />
          <Grid container spacing={3} wrap={'nowrap'}>
              <Grid container item xs={6}>
                  {champs.map((data) => {
                      if(data.team === "ORDER") {
                          return <PlayerInfo data={data} items={items} summonerSpells={summonerSpells} champions={champions} version={version}/>
                      }
                  })}
              </Grid>
              <Grid container item xs={6}>
                  {champs.map((data) => {
                      if(data.team === "CHAOS") {
                          return <PlayerInfo data={data} items={items} summonerSpells={summonerSpells} champions={champions} version={version}/>
                      }
                  })}
              </Grid>
          </Grid>
          {/*<Box display={'flex'} justifyContent={'center'} flexGrow={1}>*/}
          {/*    <Paper style={{height: '30vh', width: '70vh', }}>*/}
          {/*        {champs.map((data) => {*/}
          {/*            console.log(encodeURI(data.championName))*/}
          {/*            return <Avatar alt={`${data.championName}`} src={`http://ddragon.leagueoflegends.com/cdn/12.1.1/img/champion/${data.championName.replace(' ', '').replace('.', '')}.png`} />*/}
          {/*        })}*/}

          {/*    </Paper>*/}
          {/*</Box>*/}

      </ThemeProvider>

  );
}

export default App;