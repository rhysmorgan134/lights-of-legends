import React, { useState, useEffect } from 'react';
import {deepOrange, grey, blueGrey} from '@material-ui/core/colors'
import {createTheme, ThemeProvider, CssBaseline, Box, Grid, Modal, CircularProgress, Chip} from '@material-ui/core';
import Top from './Nav/Top'
import PlayerInfo from './components/PlayerInfo'
import Settings from "./Settings";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
let items = {}
let champions = {}
let summonerSpells = {}
let version = {}
// const {BrowserWindow,dialog,Menu} = remote



const App = (props)=> {
    const [champs, setChamps] = useState([]);
    const [open, setOpen] = useState(false);
    const [connection, setConnection] = useState({wled: false, openRGB: false, openRGBToWled: false})
    const handleOpen = () => {
        setOpen(true)
        window.ipcRenderer.send('settings')
    };
    const handleClose = () => setOpen(false);

    useEffect(() => {
        window.ipcRenderer.on('champions',  (event, data) => {
            champions = data
        })

        window.ipcRenderer.on('items',  (event, data) => {
            items = data
        })

        window.ipcRenderer.on('champions',  (event, data) => {
            summonerSpells = data
        })

        window.ipcRenderer.on('version',  (event, data) => {
            version = data[0]
        })

        window.ipcRenderer.on('champs', (event, message) => {
            setChamps(message)
        })

        window.ipcRenderer.on('update', (event, message) => {
            setChamps(message)
        })

        window.ipcRenderer.on('connection', (event, message) => {
            setConnection(message)
        })
    }, [])

    const save = (data) => {
        window.ipcRenderer.send('settingsSave', data)
    }

    const theme = createTheme({
        palette: {
            // palette values for dark mode
            divider: deepOrange[700],
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Top open={open} onClose={handleClose} handleOpen={handleOpen}/>
          <Grid container spacing={3} wrap={'wrap'}>
              <Grid container item xs={12}>
                  <Grid item xs={4}>
                      <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column" marginLeft={'30%'} marginRight={'30%'}>
                      {connection.openRGB ?
                          <Chip size={"medium"} label={"openRGB"} style={{backgroundColor: 'green'}}/>
                          : <Chip size={"medium"} label={"openRGB"} style={{backgroundColor: 'red'}}/>}
                      </Box>

                  </Grid>
                  <Grid item xs={4}>
                      <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column" marginLeft={'30%'} marginRight={'30%'}>
                      {connection.wled ?
                          <Chip size={"medium"} label={"wled"} style={{backgroundColor: 'green'}}/>
                          : <Chip size={"medium"} label={"wled"} style={{backgroundColor: 'red'}}/>}
                      </Box>
                  </Grid>
                  <Grid item xs={4}>
                      <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column" marginLeft={'30%'} marginRight={'30%'}>
                      {connection.openRGBToWled ?
                          <Chip size={"medium"} label={"openRGB - Wled"} style={{backgroundColor: 'green'}}/>
                          : <Chip size={"medium"} label={"openRGB - Wled"} style={{backgroundColor: 'red'}}/>}
                      </Box>

                  </Grid>
              </Grid>
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
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
              <Box sx={style}>
                  <Settings save={save}/>
              </Box>
          </Modal>

      </ThemeProvider>


  );
}

export default App;