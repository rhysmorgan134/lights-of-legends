import React from 'react'
import {Avatar, Box, Grid, ImageList, ImageListItem, Paper, Typography} from "@material-ui/core";
import Item from "./Item";
import EmptyItem from "./EmptyItem";

const PlayerInfo = ({data, item, summonerSpells, champions, version}) => {

    const createEmpty = (data) => {
        let result = []
        if(data.length < 7) {
            let amount = 7 - data.length
            for(let i=0;i<amount;i++) {
                result.push(<EmptyItem />)
            }
        }
        return result
    }

    return (
        <Grid item xs={12} display={'flex'}>
            <Paper sx={{ flexGrow: 1 , width: '100%'}}>
                    { data ?
                        <Grid container spacing={2} columns={16} wrap={'nowrap'}>
                            <Grid item xs={1}>
                                <Box flex={1} flexDirection={'column'} flexGrow={0} flexShrink={0}>
                                    <ImageList
                                        cols={1}
                                        rowHeight={'30'}>
                                        <ImageListItem key={'summonerSpell1'}>
                                            <img style={{objectFit: 'scale-down'}} src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${data.summonerSpells.summonerSpellOne.rawDescription.split('_')[2]}.png`} />
                                        </ImageListItem>
                                        <ImageListItem key={'summonerSpell2'}>
                                            <img src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${data.summonerSpells.summonerSpellTwo.rawDescription.split('_')[2]}.png`} />
                                        </ImageListItem>
                                    </ImageList>
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                                <Box flex={1} flexDirection={'column'} flexGrow={0}>
                                    <ImageList
                                        cols={1}
                                        rowHeight={'30'}>
                                        <ImageListItem key={'rune1'}>
                                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png`} />
                                        </ImageListItem>
                                        <ImageListItem key={'rune2'}>
                                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Transcendence/Transcendence.png`} />
                                        </ImageListItem>
                                    </ImageList>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column">
                                    <Avatar style={{width: 70, height:70}} alt={`${data.championName}`} src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${data.rawChampionName.split("_")[3]}.png`} />
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column">
                                    <Typography variant="h4" gutterBottom component="div">
                                        {data.scores.creepScore}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column">
                                    <Typography variant="h4" gutterBottom component="div">
                                        {data.scores.kills + "/" + data.scores.deaths + "/" + data.scores.assists}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={7} displat={'flex'}>
                                <Box sx={{flexGrow: 1}} height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column">
                                    <Grid container columns={21} spacing={0} wrap={'nowrap'} sx={{flexGrow: 1}} >
                                        {data.items.map((item) => {
                                            return <Item item={item} version={version}/>
                                        })}
                                        {data.items.length < 7 ?  createEmpty(data.items) : null}
                                    </Grid>
                                </Box>

                            </Grid>

                        </Grid>
                        :  <div>empty</div> }
            </Paper>
        </Grid>

    )
}

export default PlayerInfo