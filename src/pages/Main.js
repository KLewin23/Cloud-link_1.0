import React from 'react';
import {Link} from 'react-router-dom'
import Button from "@material-ui/core/Button";

class Main extends React.Component {
    render() {
        return (
            <div className="App">
                xxy
                <Link to="/home">
                    <Button variant="contained">
                        Default
                    </Button>
                </Link>
            </div>
        );
    }
}

export default Main;
