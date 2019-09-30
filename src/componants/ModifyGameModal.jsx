import React, { useState, useEffect } from "react";
import CustomButton from "./Button";
import { connect } from "react-redux";
import SetLocation from "./SetLocation";
import { IconButton, Modal, Tooltip } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import { useSpring, animated } from "react-spring";
import { Grid, withStyles, createStyles } from "@material-ui/core";
import {
    closeModal,
    setPath,
    setGamePaths,
    addGameConfig,
    changeConfigGamePath,
    setModifiedImage
} from "../store/actions";
import { AddPhotoAlternate } from "@material-ui/icons";
import CalculateAspectRation from "../scripts/functions/CalculateAspectRation";
const { ipcRenderer } = window.require("electron");
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

    const [component, setComponent] = useState(<div id={"modify-image"}></div>);

    function setLocationFinish() {
        props.setPath(
            (props.app.gamePaths[props.modal.currentGame] = props.modal.newPath)
        );
        const gamePaths = props.app.gamePaths;
        gamePaths[props.modal.currentGame] = props.modal.newPath;
        props.setGamePaths(gamePaths);
        props.changeConfigGamePath({
            name: props.modal.currentGame,
            path: props.modal.newPath
        });
        //updateFile(props.app, GetUsername());
        props.closeModal();
    }

    const verify = () => {
        props.addGameConfig({
            name: props.modal.currentGame,
            path: props.app.gamePaths[props.modal.currentGame]
        });
    };

    const verified = () => {
        // console.log(props.app.gamePaths)
        // const game = props.modal.currentGame;
        // return Object.keys(props.app.gamePaths).includes(game) &&
        //     !Object.keys(props.app.config.games).includes(game) ? (
        //     <div>
        //         Verify this is the correct save location
        //         <CustomButton
        //             click={verify}
        //             top={"50px"}
        //             justify={"center"}
        //             margin={"special"}
        //             textColor={"white"}
        //             type={"contained"}
        //             color={"black"}
        //             text={"Save"}
        //             width={"150px"}
        //             height={"40px"}
        //         />
        //     </div>
        // ) : (
        //     <div>This game is verified</div>
        // );
        return (<div></div>)
    };

    const image = file => {
        const classes = props.classes;
        console.log(props.modal.image);
        if (props.modal.image !== "" && props.modal.image !== undefined) {
            console.log("xx")
            setComponent(<div id={"modify-image"}></div>);
            const output =
                '<img style="height: 200px" src="data:image/png;base64,' +
                file +
                '" />';
            const target = document.getElementById("modify-image");
            target.insertAdjacentHTML("beforeend", output);
        } else {
            setComponent(
                <div className={classes.imagePlaceholder}>
                    <Tooltip title={"Add Image"}>
                        <IconButton onClick={getImage}>
                            <AddPhotoAlternate />
                        </IconButton>
                    </Tooltip>
                </div>
            );
        }
    };

    const getImage = () => {
        new Promise((resolve, reject) => {
            ipcRenderer.send("getImage", props.app.config.imagePath);
            ipcRenderer.on("returnImage", function(even, data) {
                const aspectRatio = CalculateAspectRation(
                    data.height,
                    data.width
                );
                if (aspectRatio[0] !== 11 || aspectRatio[1] !== 8) {
                    resolve(["", false]);
                } else {
                    props.setModifiedImage(data.location);
                    resolve([data.file, true]);
                }
            });
        }).then(data => {
            if (data[1] === true) {
                image(data);
            } else if (data[1] === false) {
                alert("Image not of correct aspect ratio: 11:8");
            }
        });
    };

    useEffect(() => {
        if (
            Object.keys(props.app.config.images).includes(
                props.modal.currentGame
            )
        ) {
            new Promise((resolve, reject) => {
                const image = ipcRenderer.sendSync(
                    "getImageRaw",
                    props.app.config.images[props.modal.currentGame]
                );
                resolve(
                    '<img style="height: 200px" src="data:image/png;base64,' +
                        image +
                        '" />'
                );
            }).then(data => {
                const target = document.getElementById("modify-image");
                target.insertAdjacentHTML("beforeend", data);
            });
        } else {
            setComponent(
                <div className={classes.imagePlaceholder}>
                    <Tooltip title={"Add Image"}>
                        <IconButton onClick={getImage}>
                            <AddPhotoAlternate />
                        </IconButton>
                    </Tooltip>
                </div>
            );
        }
    }, []);
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
                        <Grid item>{component}</Grid>
                        <Grid item>
                            <SetLocation
                                location={props.modal.currentPath}
                                type={"modify"}
                            />
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
        },
        imagePlaceholder: {
            height: 230,
            width: 180,
            backgroundColor: "#f0f0f0",
            "& button": {
                marginLeft: "50%",
                transform: "translateX(-50%)",
                marginTop: "50%"
            }
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
    changeConfigGamePath,
    setModifiedImage
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ModifyGameModal));
