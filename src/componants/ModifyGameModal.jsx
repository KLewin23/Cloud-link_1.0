import React from "react";
import { Modal } from "@material-ui/core";
import { Grid, withStyles, createStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { closeModal, setPath, setGamePaths } from "../store/actions";
import Backdrop from "@material-ui/core/Backdrop";
import { useSpring, animated } from "react-spring";
import SetLocation from "./SetLocation";
import CustomButton from "./Button";
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

    function setLocationFinish(){
        props.setPath(props.app.gamePaths[props.modal.currentGame] = props.modal.newPath);
        const gamePaths = props.app.gamePaths;
        gamePaths[props.modal.currentGame] = props.modal.newPath;
        props.setGamePaths(gamePaths);
        props.closeModal()
    }

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
                                alt={"Image Missing"}
                                src={launcherImg("./" + "dishonoured" + ".jpg")}
                                className={classes.image}
                            />
                        </Grid>
                        <Grid item>
                            <SetLocation location={props.modal.currentPath} />
                        </Grid>
                        <Grid item>
                            <CustomButton click={setLocationFinish} top={"50px"} justify={"center"} margin={"special"} textColor={"white"} type={"contained"} color={"black"} text={"Save"} width={"150px"} height={"40px"}/>
                        </Grid>
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
        image:{
            height:"200px"
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
    setGamePaths
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ModifyGameModal));
