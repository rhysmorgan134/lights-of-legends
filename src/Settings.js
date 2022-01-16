import React from 'react';
import { ChromePicker } from 'react-color';
import {Button, Grid, Typography} from "@material-ui/core";

class Settings extends React.Component {
    state = {
        background: '#fff',
        colour: {}
    };

    handleChangeComplete = (color) => {
        console.log(color)
        this.setState({ background: color.hex, colour: color });

    };

    render() {
        const save = this.props.save
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography >
                        Settings
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        Default Colour
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    Options
                </Grid>
                <Grid item xs={6}>
                    <ChromePicker
                        color={ this.state.background }
                        onChangeComplete={ this.handleChangeComplete }
                    />
                </Grid>
                <Grid item xs={6}>
                    Toggles
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => {save(this.state.colour)}}>Save</Button>
                </Grid>
            </Grid>

        );
    }
}

export default Settings