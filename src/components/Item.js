import React from 'react'
import {Box, Grid} from "@material-ui/core";

const Item = ({item, version}) => {
    return (
        <Grid item xs={3} flexGrow={1}>
            <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column">
                <img src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.itemID}.png`} style={{width: '100%', maxHeight: '100%', objectFit: 'contain'}}/>
            </Box>
        </Grid>
    )
}

export default Item