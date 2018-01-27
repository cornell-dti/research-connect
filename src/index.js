import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/App';
import Opportunities from './routes/Opportunities'
import Error from './components/Error'
import {Switch, BrowserRouter, Route} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

ReactDOM.render(
    <BrowserRouter history={history}>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route exact path='/opportunities' component={Opportunities}/>
            <Route path='/opportunity/:id' component={OpportunityListing}/>
            <Route path='/' component={Error}/>
        </Switch>
    </BrowserRouter>

    , document.getElementById('root'));
registerServiceWorker();