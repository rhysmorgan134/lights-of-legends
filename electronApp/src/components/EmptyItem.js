import React from 'react'
import {Box, Grid} from "@material-ui/core";

const EmptyItem = () => {
    return (
        <Grid item xs={3}>
            <Box height={"100%"} display={'flex'} justifyContent={'center'} flexDirection="column" style={{borderStyle: 'double', borderColor: 'yellow'}}>
            </Box>
        </Grid>
    )
}

export default EmptyItem