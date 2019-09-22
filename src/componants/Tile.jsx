import React from "react";
import {
    createStyles,
    withStyles,
    GridListTile,
    GridListTileBar,
    IconButton
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { connect } from "react-redux";
import { setPath, setGame } from "../store/actions";
import { string } from "prop-types";

const { ipcRenderer } = window.require("electron");

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            component: <div id={this.props.title}></div>
        };

        this.open = this.open.bind(this);
        // this.image = this.image.bind(this);
        // this.image();
    }

    open() {
        this.props.setGame(this.props.title);
        if (this.props.modal.currentPath === "") {
            this.props.setPath(this.props.app.gamePaths[this.props.title]);
        }
        this.props.open();
    }

    componentDidMount() {
        if (
            Object.keys(this.props.app.config.images).includes(this.props.title)
        ) {
            new Promise((resolve, reject) => {
                const image = ipcRenderer.sendSync(
                    "getImageRaw",
                    this.props.app.config.images[this.props.title]
                );
                resolve(
                    '<img style="height: 200px" src="data:image/png;base64,' +
                        image +
                        '" />'
                );
            }).then(data => {
                const target = document.getElementById(this.props.title);
                target.insertAdjacentHTML("beforeend", data);
            });
        } else {
            //this.setState({component:<img style={{height: "275px", width: "200px"}} src={require("../images/Games/dishonoured.jpg")}/> })
            this.setState({
                component: (
                    <div
                        style={{
                            height: "275px",
                            width: "200px",
                            backgroundColor: "white",
                            textAlign: "center",
                            verticalAlign: "middle",
                            lineHeight: "275px"
                        }}
                    >
                        No image set
                    </div>
                )
            });
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <GridListTile
                col={1}
                onClick={this.props.click}
                className={classes.tile}
            >
                {this.state.component}
                <GridListTileBar
                    title={
                        <span style={{ textTransform: "capitalize" }}>
                            {this.props.title}
                        </span>
                    }
                    subtitle={
                        <span style={{ textTransform: "none" }}>
                            {this.props.location}
                        </span>
                    }
                    actionIcon={
                        <IconButton
                            className={classes.icon}
                            onClick={this.open}
                        >
                            <InfoIcon />
                        </IconButton>
                    }
                />
            </GridListTile>
        );
    }
}

const styles = theme =>
    createStyles({
        image: {
            width: "200px",
            height: "275px"
        },
        tile: {
            margin: "60px"
        },
        icon: {
            color: "rgba(255, 255, 255, 0.54)"
        }
    });

const mapStateToProps = state => {
    return {
        modal: state.GameModalReducer,
        app: state.appReducer
    };
};
const mapDispatchToProps = {
    setPath,
    setGame
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Tile));
