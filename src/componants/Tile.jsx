import React from "react";
import {
    createStyles,
    withStyles,
    GridListTile,
    GridListTileBar,
    IconButton
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import image from "../images/Games/dishonoured.jpg";
import { connect } from 'react-redux';
import { setPath, setGame } from "../store/actions";

function Tile(props) {
    const classes = props.classes;

    function open(){
        props.setGame(props.title);
        if(props.modal.currentPath === ""){
            props.setPath(props.app.gamePaths[props.title]);
        }
        props.open();
    }

    return (
        <GridListTile col={1} onClick={props.click} className={classes.tile}>
            <img src={image} alt={""} className={classes.image} />
            <GridListTileBar
                title={<span style={{textTransform: "capitalize"}}>{props.title}</span>}
                subtitle={<span style={{textTransform: "none"}}>{props.location}</span>}
                className={classes.tilebar}
                actionIcon={
                    <IconButton className={classes.icon} onClick={open}>
                        <InfoIcon />
                    </IconButton>
                }
            />
        </GridListTile>
    );
}

const styles = theme =>
    createStyles({
        image: {
            width: "200px",
            height: "275px"
        },
        tilebar: {
            marginBottom: "5px"
        },
        tile: {
            margin: "60px"
        },
        icon: {
            color: "rgba(255, 255, 255, 0.54)"
        }
    });

const mapStateToProps = state => {
    return {
        modal: state.GameModalReducer,
        app: state.appReducer
    };
};
const mapDispatchToProps = {
    setPath,
    setGame
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Tile));
