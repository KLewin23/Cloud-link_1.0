import React from "react";
import { withStyles, createStyles, Typography, Grid } from "@material-ui/core";

function UserInfoBar(props) {
    const classes = props.classes
    return (
        <div>
            <Grid container direction="column" className={classes.grid}>
                <Grid item><Typography className={classes.info} variant="caption">{"Email: " + props.email}</Typography></Grid>
                <Grid item><Typography className={classes.info} variant="caption">{"Id: " + props.id}</Typography></Grid>
                <Grid item><Typography className={classes.info} variant="caption">{"OS: " + props.os}</Typography></Grid>
            </Grid>
        </div>
    );
}

const styles = theme => createStyles({
    grid:{
        marginTop: "20px",
        marginLeft: "20px"
    },
    info:{
        float: "left"
    }
});

export default withStyles(styles)(UserInfoBar);
