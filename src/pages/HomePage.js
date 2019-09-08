import React from "react";
import Logo from "../images/logo.svg";
import Button from "../componants/Button";
import GoogleButton from "react-google-button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import {
    GetFiles,
    GetOs,
    GetUsername,
    ScanDriveGameLaunchers,
    ScanDrives,
    SearchComplete
} from "../scripts";
import {
    saveOS,
    getDrives,
    setLaunchers,
    addDriveCheckMessage
} from "../store/actions";
import { connect } from "react-redux";

const request = require("request");
const { ipcRenderer } = window.require("electron");

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: ""
        };
        this.signIn = this.signIn.bind(this);
        this.signIn()
    }
    signIn() {
        GetOs()
            .then(data => this.props.saveOS(data))
            .then(() => this.props.getDrives(ScanDrives()))
            .then(() => ScanDriveGameLaunchers(GetUsername(), this.props.app))
            .then(() => GetFiles(this.props.app, GetUsername()))
            // .then(() => {
            //     const auth = ipcRenderer.sendSync("Authenticate");
            //     console.log(auth.access_token);
            //     request(
            //         {
            //             method: "get",
            //             uri: "https://www.googleapis.com/userinfo/v2/me",
            //             headers: {
            //                 "Content-Type": "application/json",
            //                 Authorization: `Bearer ${auth.access_token}`
            //             }
            //         },
            //         function(err, response, body) {
            //             if (err) {
            //                 console.log(err);
            //             } else {
            //                 console.log(body);
            //             }
            //         }
            //     );
            // })
            .then(() => SearchComplete())
            .then(() => this.setState({ redirect: <Redirect to={"/home"} /> }))
            .catch(err => console.log(err));
    }
    render() {
        const classes = this.props.classes;
        return (
            <div className="HomePage">
                {this.state.redirect}
                <img src={Logo} alt="xx" className={classes.logo} />

                <GoogleButton
                    type="light"
                    style={{ margin: "auto" }}
                    onClick={this.signIn}
                >
                    This is my custom Google button
                </GoogleButton>
                <Button
                    style={{
                        marginLeft: "50%",
                        marginTop: "20px",
                        transform: "translateX(-50%)"
                    }}
                    top={"20px"}
                    type="contained"
                    width="245px"
                    height="50px"
                    color="white"
                    margin="special"
                    icon="box"
                    justify="flex-start"
                    text="Sign in with Box"
                    textTrans="initial"
                    fontSize="16px"
                    textColor="rgba(0, 0, 0, 0.54)"
                    click={""}
                />
            </div>
        );
    }
}

const styles = theme =>
    createStyles({
        HomePage:{
            backgroundColor: "white",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontSize: "calc(10px + 2vmin)",
            color: "white"
        },
        logo: {
            marginTop: "70px",
            marginBottom: "50px",
            marginLeft: "50%",
            transform: "translateX(-50%)",
            height: "180px",
            margin: "auto"
        }
    });

const mapStateToProps = state => {
    return {
        app: state.appReducer,
        scanner: state.scannerReducer
    };
};

const mapDispatchToProps = {
    saveOS,
    getDrives,
    setLaunchers,
    addDriveCheckMessage
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(HomePage));
