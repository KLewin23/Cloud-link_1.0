import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Tile from "../../componants/Tile";
import Typography from "@material-ui/core/Typography";
import { openModal } from "../../store/actions";
import { connect } from "react-redux";
import request from "request";
import getGoogleFolderChildren from "../../scripts/functions/getGoogleFolderChildren";
import Modal from "../../componants/ModifyGameModal";
import { GridList } from "@material-ui/core";



function CloudTab(props) {
    const classes = props.classes;
    const games =
        JSON.stringify(props.google.clGames) !== '[]' &&
        JSON.stringify(props.google.clGames) !== 'undefined'
            ? props.google.clGames.map(game => (
                <Tile
                    key={game.id}
                    id={game.id}
                    title={game.name}
                    open={props.openModal}
                    location={'Cloud'}
                />
            ))
            : (<Typography variant={"h2"} style={{color: "white"}}>No Games Found.</Typography>);

    return (
        <div style={{ margin: "auto" }}>
            <Modal />
            <GridList className={classes.list}>{games}</GridList>
        </div>
    );
}

const styles = theme =>
    createStyles({
        test: {
            height: "initial"
        },
        list: {
            padding: "0px 50px 0px 50px"
        }
    });

const mapStateToProps = state => {
    return {
        app: state.appReducer,
        google: state.GoogleReducer
    };
};
const mapDispatchToProps = {
    openModal
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(CloudTab));
