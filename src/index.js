import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/App';
import Opportunities from './routes/Opportunities';
import OpportunityPage from './routes/OpportunityPage';
import Reference from './routes/Reference';
import Error from './components/Error';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import CreateOpportunityForm from './routes/CreateOpportunityForm';
import InstructorRegister from './routes/InstructorRegister';
import StudentRegister from './routes/StudentRegister';
import ProfessorView from './routes/ProfessorView';
import ApplicationPage from './routes/ApplicationPage';
import EditProfile from './routes/EditProfile';
import Doc from './routes/Doc';
import LandingPage from './routes/LandingPage';

console.log("hello there!!!!");

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/app/opportunities' component = {Opportunities} />
            <Route path='/app/opportunity/:id' component = {OpportunityPage} />
            <Route path='/app/application/:id' component = {ApplicationPage} />
            <Route exact path='/app/newopp' component = {CreateOpportunityForm} />
            <Route exact path='/app/instructorRegister' component = {InstructorRegister} />
            <Route exact path='/app/StudentRegister' component = {StudentRegister} />
            <Route exact path='/app/professorView' component = {ProfessorView} />
            <Route path = '/app/doc/:id' component = {Doc} />
            <Route exact path='/app/editProfile' component = {EditProfile} />
            <Route exact path='/app' component = {LandingPage} />
            <Route path='/' component = {Error} />
        </Switch>
    </BrowserRouter>, document.getElementById('root')
);
registerServiceWorker();
