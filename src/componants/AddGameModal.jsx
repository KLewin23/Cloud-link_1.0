import React from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { IconButton, Modal, Tooltip } from "@material-ui/core";
import { closeModal, setGamePaths, setPath } from "../store/actions";
import { connect } from "react-redux";
import { openAddGame, closeAddGame} from "../store/actions";
import Backdrop from "@material-ui/core/Backdrop";
import SetLocation from "./SetLocation";
import { AddCircleOutline, AddPhotoAlternate } from "@material-ui/icons";

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
            <div className={classes.paper}>
                <div className={classes.imagePlaceholder}>
                    <Tooltip title={"Add Image"}>
                        <IconButton  onClick={props.openAddGame}>
                            <AddPhotoAlternate/>
                        </IconButton>
                    </Tooltip>
                </div>
                <SetLocation/>
            </div>
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
    },
    imagePlaceholder:{
        height: 230,
        width: 180,
        backgroundColor: "#f0f0f0",
        "& button": {
            marginLeft: "50%",
            transform: "translateX(-50%)",
            marginTop: "50%"
        }
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