import React from "react";
import CustomButton from "./Button";
import { connect } from "react-redux";
import SetLocation from "./SetLocation";
import { Modal } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import { useSpring, animated } from "react-spring";
import { Grid, withStyles, createStyles } from "@material-ui/core";
import {
    closeModal,
    setPath,
    setGamePaths,
    addGameConfig,
    changeConfigGamePath
} from "../store/actions";
const launcherImg = require.context("../images/Games", true);

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0, outline: "none" },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        }
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

function ModifyGameModal(props) {
    const classes = props.classes;
    const open = props.modal.state;
    function setLocationFinish() {
        props.setPath(
            (props.app.gamePaths[props.modal.currentGame] = props.modal.newPath)
        );
        const gamePaths = props.app.gamePaths;
        gamePaths[props.modal.currentGame] = props.modal.newPath;
        props.setGamePaths(gamePaths);
        props.changeConfigGamePath({name: props.modal.currentGame, path: props.modal.newPath});
        //updateFile(props.app, GetUsername());
        props.closeModal();
    }

    const verify = () => {
        props.addGameConfig({ name: props.modal.currentGame, path: props.app.gamePaths[props.modal.currentGame]});
    };

    const verified = () => {
        const game = props.modal.currentGame;
        return Object.keys(props.app.gamePaths).includes(game) &&
            !Object.keys(props.app.config.games).includes(game) ? (
            <div>
                Verify this is the correct save location
                <CustomButton
                    click={verify}
                    top={"50px"}
                    justify={"center"}
                    margin={"special"}
                    textColor={"white"}
                    type={"contained"}
                    color={"black"}
                    text={"Save"}
                    width={"150px"}
                    height={"40px"}
                />
            </div>
        ) : (
            <div>This game is verified</div>
        );
    };

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className={classes.modal}
            open={open}
            onClose={props.closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <Grid>
                        <Grid item>
                            <img
                                src={launcherImg("./" + "dishonoured" + ".jpg")}
                                className={classes.image}
                                alt={"Missing"}
                            />
                        </Grid>
                        <Grid item>
                            <SetLocation location={props.modal.currentPath} type={"modify"} />
                        </Grid>
                        <Grid item>
                            <CustomButton
                                click={setLocationFinish}
                                top={"50px"}
                                justify={"center"}
                                margin={"special"}
                                textColor={"white"}
                                type={"contained"}
                                color={"black"}
                                text={"Save"}
                                width={"150px"}
                                height={"40px"}
                            />
                        </Grid>
                        {verified()}
                    </Grid>
                </div>
            </Fade>
        </Modal>
    );
}

const styles = theme =>
    createStyles({
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
    });

const mapStateToProps = state => {
    return {
        modal: state.GameModalReducer,
        app: state.appReducer
    };
};

const mapDispatchToProps = {
    closeModal,
    setPath,
    setGamePaths,
    addGameConfig,
    changeConfigGamePath
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ModifyGameModal));
