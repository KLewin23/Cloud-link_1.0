import React from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import { closeModal, setGamePaths, setPath } from "../store/actions";
import { connect } from "react-redux";
import { openAddGame, closeAddGame} from "../store/actions";
import Backdrop from "@material-ui/core/Backdrop";

function AddGameModal(props) {
    const classes = props.classes;
    const open = props.modal.state;

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className={classes.modal}
            open={open}
            onClose={props.closeAddGame}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <h1>xx</h1>
        </Modal>
    );
}

const styles = createStyles(theme => ({
    paper: {
        width: 400,
        height: 600,
        backgroundColor: "white",
        padding: theme.spacing(2, 4, 3),
        outline: "none"
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none"
    },
    image: {
        height: "200px"
    }
}));

const mapStateToProps = state => {
    return {
        modal: state.AddGameReducer
    };
};

const mapDispatchToProps = {
    closeAddGame
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AddGameModal));