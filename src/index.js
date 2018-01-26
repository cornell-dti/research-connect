import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/App';
import Opportunities from './routes/Opportunities'
import Error from './components/Error'
import {Switch, BrowserRouter, Route} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component = {App} />
            <Route exact path='/Opportunities' component = {Opportunities} />
            <Route path='/' component = {Error} />
        </Switch>
    </BrowserRouter>

    , document.getElementById('root'));
registerServiceWorker();
