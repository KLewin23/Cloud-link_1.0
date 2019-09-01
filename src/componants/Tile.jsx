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

function Tile(props) {
    const classes = props.classes;
    return (
        <GridListTile col={1} onClick={props.click} className={classes.tile}>
            <img src={image} alt={""} className={classes.image} />
            <GridListTileBar
                title={props.title}
                subtitle={<span>{props.location}</span>}
                className={classes.tilebar}
                actionIcon={
                    <IconButton className={classes.icon}>
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

export default withStyles(styles)(Tile);
