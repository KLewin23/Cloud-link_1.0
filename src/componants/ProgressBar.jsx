import React from "react";
import { LinearProgress, createStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

function ProgressBar(props) {
    const classes = props.classes
    const [completed, setCompleted] = React.useState(0);
    const [buffer, setBuffer] = React.useState(10);

    const progress = React.useRef(() => {});
    React.useEffect(() => {
        progress.current = () => {
            if (completed < 100) {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setCompleted(completed + diff);
                setBuffer(completed + diff + diff2);
            }
        };
    });

    React.useEffect(() => {
        function tick() {
            progress.current();
        }
        const timer = setInterval(tick, 500);
    }, []);

    return (
        <div className={classes.root}>
            <LinearProgress
                variant="buffer"
                value={completed}
                valueBuffer={buffer}
                style={{width: props.width}}
            />
        </div>
    );
}

const styles = theme =>
    createStyles({
        root: {
            flexGrow: 1,
        }
    });

export default withStyles(styles)(ProgressBar);
