import React from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { TextField, IconButton, InputAdornment } from "@material-ui/core";
import { Folder } from "@material-ui/icons";
import clsx from "clsx";
import { connect } from "react-redux";
import { setNewPath, setGamePaths, setGamePath } from "../store/actions";

const { ipcRenderer } = window.require("electron");

function SetLocation(props) {
    const classes = props.classes;

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [values, setValues] = React.useState({
        location: props.location
    });

    function getFolder() {
        ipcRenderer.send("getFolder");
        ipcRenderer.on("returnFolder", function(even, data) {
            if(props.type === "modify"){
                props.setNewPath(data[0]);
            } else if (props.type === "new"){
                props.setGamePath(data[0])
            }
            setValues({ ...values, location: data[0] });
        });
    }

    return (
        <TextField
            margin={props.margin}
            id="outlined-adornment-password"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            type={"text"}
            label="Save location"
            value={values.location}
            onChange={handleChange("password")}
            style={{ marginTop: "30px", width: "100%" }}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            aria-label="Change save location"
                            onClick={getFolder}
                        >
                            <Folder />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}

const styles = theme =>
    createStyles({
        list: {
            padding: "0px 50px 0px 50px"
        }
    });

const mapStateToProps = state => {
    return {
        modal: state.GameModalReducer,
        app: state.appReducer
    };
};

const mapDispatchToProps = {
    setNewPath,
    setGamePaths,
    setGamePath
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SetLocation));
