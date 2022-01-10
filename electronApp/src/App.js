import {HashRouter,Link,Route,Routes} from "react-router-dom";
import React, { useState } from 'react';
import {deepOrange, deepPurple, grey, blueGrey} from '@material-ui/core/colors'
import {Paper, Switch, Typography, createTheme, ThemeProvider, CssBaseline, Box, Avatar} from '@material-ui/core';
import Top from './Nav/Top'


const App = (props)=> {
    const [darkMode, setDarkMode] = useState(false);

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
          <Box display={'flex'} justifyContent={'center'} flexGrow={1}>
              <Paper style={{height: '30vh', width: '70vh', }}>
                    <Avatar alt={"Riven"} src={'http://ddragon.leagueoflegends.com/cdn/12.1.1/img/champion/Riven.png'} />
              </Paper>
          </Box>

      </ThemeProvider>

  );
}

export default App;