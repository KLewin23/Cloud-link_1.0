import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import Button from "@material-ui/core/Button";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            comp: ""
        };
        new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, 3000);
        }).then((value)=>{
            this.setState({comp: <Redirect to={"/"}/>})
        })
    }
    render() {
        return (

            <div className="App">
                xxy
                {this.state.comp}
                <Link to="/home">
                    <Button variant="contained">
                        Default
                    </Button>
                </Link>

            </div>
        );
    }
}

export default App;
