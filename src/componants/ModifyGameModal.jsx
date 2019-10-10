import React from "react";
import CustomButton from "./Button";
import { connect } from "react-redux";
import SetLocation from "./SetLocation";
import { IconButton, Dialog, Tooltip, TextField } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import { Grid, withStyles, createStyles } from "@material-ui/core";
import {
    closeModal,
    setPath,
    setGamePaths,
    addGameConfig,
    changeConfigGamePath,
    setModifiedImage,
    makeModified,
    unModified,
    saveConfig,
    addImage
} from "../store/actions";
import { AddPhotoAlternate, Warning, Done } from "@material-ui/icons";
import CalculateAspectRation from "../scripts/functions/CalculateAspectRation";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
const { ipcRenderer } = window.require("electron");

class ModifyGameModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            component: (
                <div
                    id={"modify-image"}
                    style={{ marginRight: "90px", float: "left" }}
                ></div>
            ),
            name: ""
        };
        this.getImage = this.getImage.bind(this);
        this.image = this.image.bind(this);
        this.opened = this.opened.bind(this);
        this.verified = this.verified.bind(this);
        this.verify = this.verify.bind(this);
        this.save = this.save.bind(this);
    }

    opened() {
        this.props.unModified()
        this.setState({ name: this.props.modal.currentGame });
        if (
            Object.keys(this.props.app.config.images).includes(
                this.props.modal.currentGame
            )
        ) {
            new Promise((resolve, reject) => {
                const image = ipcRenderer.sendSync(
                    "getImageRaw",
                    this.props.app.config.images[this.props.modal.currentGame]
                );
                resolve(
                    '<img style="height: 200px" src="data:image/png;base64,' +
                        image +
                        '" />'
                );
            }).then(data => {
                this.props.setModifiedImage(
                    this.props.app.config.images[this.props.modal.currentGame]
                );
                const target = document.getElementById("modify-image");
                target.insertAdjacentHTML("beforeend", data);
            });
        } else {
            this.setState({
                component: (
                    <div
                        className={this.props.classes.imagePlaceholder}
                        style={{ marginRight: "90px", float: "left" }}
                    >
                        <Tooltip title={"Add Image"}>
                            <IconButton onClick={this.getImage}>
                                <AddPhotoAlternate />
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            });
        }
    }

    save() {
        new Promise(resolve => {
            const gamePaths = this.props.app.gamePaths;
            gamePaths[this.props.modal.currentGame] = this.props.modal.newPath;
            this.props.setGamePaths(gamePaths);
            this.props.changeConfigGamePath({
                name: this.props.modal.currentGame,
                path: this.props.modal.newPath
            });
            this.props.addImage({
                name: this.props.modal.currentGame,
                path: this.props.modal.image
            });
            resolve();
        }).then(() => {
            this.props.saveConfig();
            this.props.closeModal();
            this.props.unModified();
        });
    }

    verify() {
        this.props.addGameConfig({
            name: this.props.modal.currentGame,
            path: this.props.app.gamePaths[this.props.modal.currentGame]
        });
    }

    image(file) {
        const classes = this.props.classes;
        if (
            this.props.modal.image !== "" &&
            this.props.modal.image !== undefined
        ) {
            this.setState({
                component: (
                    <div
                        id={"modify-image"}
                        style={{ marginRight: "90px" }}
                    ></div>
                )
            });
            const output =
                '<img style="height: 200px" src="data:image/png;base64,' +
                file[0] +
                '" />';
            const target = document.getElementById("modify-image");
            target.insertAdjacentHTML("beforeend", output);
            this.props.makeModified();
        } else {
            this.setState({
                component: (
                    <div
                        className={classes.imagePlaceholder}
                        style={{ marginRight: "90px" }}
                    >
                        <Tooltip title={"Add Image"}>
                            <IconButton onClick={this.getImage}>
                                <AddPhotoAlternate />
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            });
        }
    }

    getImage() {
        const props = this.props;
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
                this.image(data);
            } else if (data[1] === false) {
                alert("Image not of correct aspect ratio: 11:8");
            }
        });
    }

    verified() {
        const game = this.props.modal.currentGame;
        return Object.keys(this.props.app.gamePaths).includes(game) &&
            !Object.keys(this.props.app.config.games).includes(game) ? (
            <div>
                <Typography variant={"caption"}>
                    Verify this is the correct save location
                </Typography>
                <CustomButton
                    click={this.verify}
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
            <Typography variant={"caption"}> game is verified</Typography>
        );
    }

    render() {
        const classes = this.props.classes;
        const open = this.props.modal.state;
        const modified =
            this.props.modal.modified === true ? (
                <Typography
                    style={{ verticalAlign: "middle" }}
                    variant={"caption"}
                >
                    Changes need saving!
                </Typography>
            ) : (
                <Typography
                    variant={"caption"}
                    style={{ verticalAlign: "middle" }}
                >
                    All Changes Saved.
                </Typography>
            );
        const icon =
            this.props.modal.modified === true ? (
                <Warning
                    style={{
                        color: "red",
                        verticalAlign: "middle",
                        marginLeft: "10px"
                    }}
                />
            ) : (
                <Done
                    style={{
                        color: "green",
                        verticalAlign: "middle",
                        marginLeft: "10px"
                    }}
                />
            );

        return (
            <Dialog
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.modal}
                open={open}
                onClose={this.props.closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
                onEnter={this.opened}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <Grid>
                            <Grid item>
                                {this.state.component}
                                <Typography
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {this.props.modal.currentGame}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    margin={this.props.margin}
                                    id="outlined-adornment-password"
                                    variant="outlined"
                                    type={"text"}
                                    label="Name"
                                    value={this.state.name}
                                    onChange={e => {
                                        this.setState({ name: e.target.value });
                                        if (e.target.value !== this.props.modal.currentGame){
                                            this.props.makeModified();
                                        } else {
                                            this.props.unModified();
                                        }

                                    }}
                                    style={{ marginTop: "30px", width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <SetLocation
                                    location={this.props.modal.currentPath}
                                    type={"modify"}
                                />
                            </Grid>
                            <Grid item>
                                <CustomButton
                                    click={this.save}
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
                            <Grid item>
                                {modified}
                                {icon}
                            </Grid>

                            {this.verified()}
                        </Grid>
                    </div>
                </Fade>
            </Dialog>
        );
    }
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
    setModifiedImage,
    makeModified,
    unModified,
    saveConfig,
    addImage
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ModifyGameModal));
