import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { openAddGame } from "../store/actions";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

function SimpleSnackbar(props) {
    const classes = props.classes;
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={props.open}
                //autoHideDuration={6000}
                ContentProps={{
                    "aria-describedby": "message-id"
                }}
                message={
                    <span id="message-id">
                        {props.message}
                        <CircularProgress
                            className={classes.progress}
                            color="secondary"
                        />
                    </span>
                }
            />
        </div>
    );
}

const styles = createStyles(theme => ({
    progress: {
        height: "20px !important",
        width: "20px !important",
        marginLeft: "20px",
        verticalAlign: "middle"
    },
    close: {
        padding: theme.spacing(0.5)
    }
}));

const mapStateToProps = state => {
    return {
        google: state.GoogleReducer
    };
};
const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SimpleSnackbar));
