import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { createStyles } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

function ActionWheel(props){

    const actions = [
        { icon: <FileCopyIcon />, name: 'Copy' },
        { icon: <SaveIcon />, name: 'Save' },
        { icon: <PrintIcon />, name: 'Print' },
        { icon: <ShareIcon />, name: 'Share' },
        { icon: <CloudUploadIcon />, name: 'Upload' },
    ];

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const classes = props.classes;
    return(
        <div className={classes.exampleWrapper}>
            <SpeedDial
                ariaLabel="SpeedDial example"
                className={classes.speedDial}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                direction={"left"}
            >
                {actions.map(action => (
                    <SpeedDialAction
                        className={classes.action}
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={handleClose}
                    />
                ))}
            </SpeedDial>
        </div>
    )
}

const styles = theme =>
    createStyles({
        root: {
            transform: 'translateZ(0px)',
            flexGrow: 1,
        },
        exampleWrapper: {
            position: 'sticky',
            marginTop: "40px",
            zIndex: 20,
            bottom: "50px",
            right: "50px"
        },
        radioGroup: {
            margin: theme.spacing(1, 0),
        },
        speedDial: {
            '& button':{
                backgroundColor: "#202020"
            },
            '&:hover button':{
                backgroundColor: "#202020"
            },
            position: 'absolute',
            '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
                bottom: theme.spacing(2),
                right: theme.spacing(2),
            },
            '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
                top: theme.spacing(2),
                left: theme.spacing(2),
            }
        },
        action:{
            backgroundColor: "white !important"
        }
    });

export default withStyles(styles)(ActionWheel)