import React from "react";
import { withStyles, createStyles } from "@material-ui/styles";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import { Grid, Typography } from "@material-ui/core";
import {connect} from 'react-redux'
import {toggleFullscreen} from '../store/actions'
import {FontAwesomeIcon} from '@fortawesome/fontawesome-free'
import { faTimes,faWindowMinimize} from '@fortawesome/free-solid-svg-icons'
const { ipcRenderer } = window.require("electron");

function TopBar(props) {
    const classes = props.classes;
    var max
    if(props.app.location === 'Home' || props.app.location === "Drive Check"){
        max = <div></div>
    }
    else if (props.app.fullscreen === 0) {
        max = (
            <Fullscreen
                className={classes.icons}
                onClick={() => {
                    ipcRenderer.send("toggle_maximize");
                    props.toggleFullscreen()
                }}
            />
        );
    }else if (props.app.fullscreen === 1){
        max = (
            <FullscreenExit
                className={classes.icons}
                onClick={() => {
                    ipcRenderer.send("toggle_maximize");
                    props.toggleFullscreen()
                }}
            />
        )
    }
    return (
        <div className={classes.topbar}>
            {/*<Grid container justify="flex-start" style={{ height: "100%" }}>*/}
            {/*    <Grid*/}
            {/*        item*/}
            {/*        style={{ marginLeft: "8px", paddingTop: "4px",  width: "20px" }}*/}
            {/*        className={classes.controls}*/}
            {/*        onClick={() => {ipcRenderer.send("close-window");}}*/}
            {/*    >*/}
            {/*        <FontAwesomeIcon color="white" className={classes.icons} icon={faTimes}/>*/}
            {/*    </Grid>*/}
            {/*    <Grid*/}
            {/*        item*/}
            {/*        style={{ paddingTop: "2px", width: "20px" }}*/}
            {/*        className={classes.controls}*/}
            {/*        onClick={() => {ipcRenderer.send("minimize");}}*/}
            {/*    >*/}
            {/*        <FontAwesomeIcon color="white" className={classes.icons} style={{fontSize:"12px"}} icon={faWindowMinimize}/>*/}
            {/*    </Grid>*/}
            {/*    <Grid*/}
            {/*        item*/}
            {/*        style={{ paddingTop: "2px" }}*/}
            {/*        className={classes.controls}*/}
            {/*    >*/}
            {/*        {max} */}
            {/*    </Grid>*/}
            {/*    <Typography variant="caption" className={classes.title} style={{color:"white"}}>{props.app.location}</Typography>*/}
            {/*</Grid>*/}
        </div>
    );
}
//ipcRenderer.send("minimize");
const styles = theme =>
    createStyles({
        topbar: {
            width: "100%",
            height: "25px",
            backgroundColor: "#1880db"
        },
        icons: {
            cursor: 'pointer',
            color: "white",
            "&:hover": {
                cursor: 'pointer'
            }
        },
        controls: {
            cursor:"pointer",
            height: "25px",
            "&:hover": {
                cursor: "pointer",
                backgroundColor: "#2595f7"
            }
        },
        title:{
            fontWeight: "bold",
            position: "absolute",
            marginLeft: "50%",
            transform: "translateX(-50%)",
            alignSelf: "center"
        }
    });
const mapStateToProps = state => {
    return {
        app: state.appReducer
    };
};

const mapDispatchToProps = {
    toggleFullscreen
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(TopBar));
