import React from "react";
import PropTypes from "prop-types";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import HomeTab from "./SubPages/Home";
import CloudTab from "./SubPages/Cloud";
import MachineTab from "./SubPages/MachineGames";
import { connect } from "react-redux";
import { SettingsApplicationsSharp, AddCircleOutline } from "@material-ui/icons"
import { IconButton, Typography, Tab, Tabs, AppBar, Tooltip } from "@material-ui/core";
import { openAddGame } from "../store/actions";
import Modal from '../componants/AddGameModal'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

function SimpleTabs(props) {
    const classes = props.classes;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div className={classes.root}>
            <Modal />
            <AppBar position="static" className={classes.appBar}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    style={{height: "100%"}}
                >
                    <StyledTab label="Home" {...a11yProps(0)} />
                    <StyledTab label="Your Machine" {...a11yProps(1)} />
                    <StyledTab label="Cloud" {...a11yProps(2)} />

                </StyledTabs>
                <div className={classes.controls}>
                    <Tooltip title={"Add Game"}>
                        <IconButton  onClick={props.openAddGame}>
                            <AddCircleOutline className={classes.settings}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Settings"}>
                        <IconButton style={{marginLeft: "20px"}}>
                            <SettingsApplicationsSharp className={classes.settings}/>
                        </IconButton>
                    </Tooltip>
                </div>
            </AppBar>
            <TabPanel
                value={value}
                style={{
                    padding: "0px",
                    backgroundColor: "#171717",
                    height: "100%"
                }}
                index={0}
            >
                <HomeTab/>
            </TabPanel>
            <TabPanel
                value={value}
                style={{ padding: "0px", backgroundColor: "#171717" }}
                index={1}
            >
                <MachineTab games={props.app.gamePaths} />
            </TabPanel>
            <TabPanel
                value={value}
                style={{ padding: "0px", backgroundColor: "#171717" }}
                index={2}
            >
                <CloudTab />
            </TabPanel>
        </div>
    );
}

const StyledTabs = withStyles({
    indicator: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        "& > div": {
            width: "100%",
            backgroundColor: "white"
        }
    }
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: "none",
        color: "#fff",
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        "&:focus": {
            opacity: 1
        }
    }
}))(props => <Tab disableRipple {...props} />);

const styles = createStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    appBar: {
        backgroundColor: "#202020"
    },
    settings: {
        color: "white"
    },
    controls:{
        position: "absolute",
        display: "inline-block",
        right: "100px"
    }
}));

const mapStateToProps = state => {
    return {
        app: state.appReducer,
        scanner: state.scannerReducer
    };
};

const mapDispatchToProps = {
    openAddGame
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SimpleTabs));