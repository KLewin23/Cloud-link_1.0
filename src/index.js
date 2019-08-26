import React from 'react';
import store from './store'
import {render} from 'react-dom';
import { Provider } from 'react-redux'
import HomePage from "./pages/HomePage";
import Main from "./pages/Main";
import * as serviceWorker from './serviceWorker';
import { HashRouter, Switch, Route } from 'react-router-dom'

render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/home" component={Main} />
            </Switch>
        </HashRouter>
    </Provider>
    ,document.getElementById('root')
);

serviceWorker.unregister();



