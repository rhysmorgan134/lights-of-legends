import React from 'react';
import { ChromePicker } from 'react-color';
import {
    Button, FormControl,
    FormControlLabel,
    FormGroup, FormHelperText,
    Grid,
    Input,
    InputLabel,
    Switch,
    TextField,
    Typography
} from "@material-ui/core";


class Settings extends React.Component {

    _isMounted = false;
    state = {
        background: '#fff',
        colour: {},
        settings: {
            'wled': true,
            'openRGB': true,
            'wledURL': '192.168.0.204'
        },
        lastColour: {},
        hardSave: false
    };

    handleChangeComplete = (color) => {
        this.setState({ background: color.hex, lastColour: color, settings: {...this.state.settings, defaultCol:[color.rgb.r, color.rgb.g, color.rgb.b]}});
    };

    updateWled(event) {
            this.setState({settings: {...this.state.settings, wled: event.target.checked}, hardSave: true})
    }

    updateOpenRGB(event) {
        this.setState({settings: {...this.state.settings, openRGB: event.target.checked}, hardSave: true})
    }

    updateUrl(event) {
        this.setState({settings: {...this.state.settings, wledURL: event.target.value}, hardSave: true})
    }

    componentDidMount() {
        this._isMounted = true;
        window.ipcRenderer.on('settingsRes', (event, data) => {
            if(this._isMounted) {
                this.receiveSettings(event, data)
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.ipcRenderer.removeListener('settingsRes', this.receiveSettings)
    }

    receiveSettings(event, data) {
        this.setState({settings: data})
    }


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
                <Grid container item xs={6}>
                    <Grid item xs={12}>
                        <Typography>Switches</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <ChromePicker
                        color={ this.state.lastColour }
                        onChangeComplete={ this.handleChangeComplete }
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormGroup>
                        <FormControlLabel control={<Switch
                            checked={this.state.settings.wled}
                            onChange={this.updateWled.bind(this)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />} label={'Wled'} />
                        <FormControlLabel control={<Switch
                            checked={this.state.settings.openRGB}
                            onChange={this.updateOpenRGB.bind(this)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />} label={'OpenRGB'} />
                        <FormControl variant="standard">
                            <InputLabel htmlFor="component-disabled">URL</InputLabel>
                            <Input id="component-disabled" value={this.state.settings.wledURL} onChange={(event) => this.updateUrl(event)} />
                            <FormHelperText>Enter Wled URL</FormHelperText>
                        </FormControl>
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => {save([this.state.settings, this.state.hardSave])}}>Save</Button>
                </Grid>
            </Grid>

        );
    }
}

export default Settings