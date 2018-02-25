import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import milligram from 'milligram';
import App from './routes/App';
import Opportunities from './routes/Opportunities';
import OpportunityPage from './routes/OpportunityPage';
import Reference from './routes/Reference';
import Error from './components/Error';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import CreateOpportunityForm from './routes/CreateOpportunityForm';
import InstructorRegister from './routes/InstructorRegister';
import ProfessorView from './routes/ProfessorView';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component = {App} />
            <Route exact path='/opportunities' component = {Opportunities} />
            <Route path='/opportunity/:id' component = {OpportunityPage} />
            <Route exact path='/reference' component = {Reference} />
            <Route exact path='/newopp' component = {CreateOpportunityForm} />
            <Route exact path='/instructorRegister' component = {InstructorRegister} />
            <Route exact path='/professorView' component = {ProfessorView} />
            <Route path='/' component = {Error} />
        </Switch>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
