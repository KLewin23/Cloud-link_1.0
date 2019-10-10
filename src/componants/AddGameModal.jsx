import React from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { IconButton, Modal, TextField, Tooltip } from "@material-ui/core";
import { connect } from "react-redux";
import { closeAddGame, setImage, addNewGame } from "../store/actions";
import Backdrop from "@material-ui/core/Backdrop";
import SetLocation from "./SetLocation";
import { AddPhotoAlternate } from "@material-ui/icons";
import CustomButton from "./Button";
import CalculateAspectRation from "../scripts/functions/CalculateAspectRation";

const { ipcRenderer } = window.require("electron");

class AddGameModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSelector: <div></div>,
            name: ""
        };
        this.save = this.save.bind(this);
        this.image = this.image.bind(this);
        this.getImage = this.getImage.bind(this);
    }

    componentDidMount() {
        this.image();
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
                    console.log(aspectRatio)
                    reject();
                } else {
                    props.setImage(data.location);
                    resolve(data.file);
                }
            });
        })
            .then(data => this.image(data))
            .catch(() => {
                alert("Image not of correct aspect ratio: 11:8");
            });
    }

    image(file) {
        const classes = this.props.classes;
        if (
            this.props.modal.image !== "" &&
            this.props.modal.image !== undefined
        ) {
            this.setState({
                imageSelector: <div id={"image_container"}></div>
            });
            const output =
                '<img style="height: 200px" src="data:image/png;base64,' +
                file +
                '" />';
            const target = document.getElementById("image_container");
            target.insertAdjacentHTML("beforeend", output);
        } else {
            this.setState({
                imageSelector: (
                    <div className={classes.imagePlaceholder}>
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
        this.props.addNewGame({
            name: this.state.name,
            path: this.props.modal.path,
            image: this.props.modal.image
        });
    }

    render() {
        const classes = this.props.classes;
        const open = this.props.modal.state;

        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.modal}
                open={open}
                onClose={this.props.closeAddGame}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <div className={classes.paper}>
                    {this.state.imageSelector}
                    <TextField
                        margin={this.props.margin}
                        id="outlined-adornment-password"
                        variant="outlined"
                        type={"text"}
                        label="Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                        style={{ marginTop: "30px", width: "100%" }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <SetLocation type={"new"} />
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
                </div>
            </Modal>
        );
    }
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
}));

const mapStateToProps = state => {
    return {
        modal: state.AddGameReducer,
        app: state.appReducer
    };
};

const mapDispatchToProps = {
    closeAddGame,
    setImage,
    addNewGame
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AddGameModal));
