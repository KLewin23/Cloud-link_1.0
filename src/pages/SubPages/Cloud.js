import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";

function CloudTab(props) {
    const classes = props.classes;
    return <div className={classes.test}>Cloud</div>;
}

const styles = theme =>
    createStyles({
        test: {
            height: "initial"
        }
    });

export default withStyles(styles)(CloudTab);
