import React from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { GridList } from "@material-ui/core";
import Tile from "../../componants/Tile";
import Modal from '../../componants/ModifyGameModal'
import {connect} from 'react-redux'
import { openModal } from "../../store/actions";

function MachineTab(props) {
    const classes = props.classes;

    const games = Object.keys(props.games).map((game)=>(
        <Tile key={game} title={game} open={props.openModal} location={props.games[game]}/>
    ));

    return (
        <div style={{margin: "auto"}}>
            <Modal />
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

const mapStateToProps = state => {
    return {
        modal: state.GameModalReducer
    };
};
const mapDispatchToProps = {
    openModal
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(MachineTab));
