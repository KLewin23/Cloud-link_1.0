import React from 'react';
import Logo from "../images/logo.svg";
import Button from "../componants/Button";
import {GoogleLogin} from "react-google-login";
import GoogleButton from "react-google-button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import {Redirect} from "react-router-dom";
const { ipcRenderer } = window.require("electron");

class HomePage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            redirect: ""
        };
        this.signIn = this.signIn.bind(this);
    }
    signIn(){
        this.setState({redirect: (<Redirect to={"/home"}/>)})
    }
    render(){
        const classes = this.props.classes;
        return (
            <div className="HomePage">
                {this.state.redirect}
                <img src={Logo} alt="xx" className={classes.logo} />
                <GoogleLogin
                    className={classes.button}
                    clientId="522213692282-vunu5kbjm3fehg8du5cmltebp8gjrfvt.apps.googleusercontent.com"
                    render={renderProps => (
                        <GoogleButton type="light" style={{ margin: "auto" }} onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</GoogleButton>
                    )}
                    buttonText="Login"
                    onSuccess={this.signIn}
                    onFailure={""}
                    cookiePolicy={"single_host_origin"}
                />
                <Button
                    style={{marginLeft: "50%", marginTop:"20px", transform: "translateX(-50%)"}}
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
        HomePage: {
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
            margin:"auto"
        },
    });

export default withStyles(styles)(HomePage)