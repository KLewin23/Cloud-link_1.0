import React from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { GridList } from "@material-ui/core";
import Tile from "../../componants/Tile";

function MachineTab(props) {
    const classes = props.classes

    console.log(props.games)

    const games = Object.keys(props.games).map((game)=>(
        <Tile title={game} location={props.games[game]}/>
    ))

    return (
        <div style={{margin: "auto"}}>
            <GridList className={classes.list}>
                {games}
            </GridList>
        </div>
    );
}

const styles = theme =>
    createStyles({
        list:{
            padding: "0px 50px 0px 50px"
        }
    });

export default withStyles(styles)(MachineTab)
