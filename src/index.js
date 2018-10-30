import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Opportunities from './routes/Opportunities/Opportunities';
import OpportunityPage from './routes/OpportunityPage/OpportunityPage';
import Error from './components/Error/Error';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import CreateOpportunityForm from './routes/CreateOpportunityForm/CreateOpportunityForm';
import EditOpportunityForm from './routes/CreateOpportunityForm/EditOpportunityForm';
import InstructorRegister from './routes/InstructorRegister/InstructorRegister'; 
import StudentRegister from './routes/StudentRegister/StudentRegister';
import ProfessorView from './routes/ProfessorView/ProfessorView';
import ProfessorDashboard from './routes/ProfessorDashboard/ProfessorDashboard';
import ApplicationPage from './routes/ApplicationPage/ApplicationPage';
import EditProfile from './routes/EditProfile/EditProfile';
import FacultySearch from './routes/FacultySearch/FacultySearch';
import FacultyPage from './routes/FacultyPage/FacultyPage';
import Doc from './routes/Doc/Doc';
import LandingPage from './routes/LandingPage/LandingPage';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/opportunities' component={Opportunities} />
            <Route path='/opportunity/:id' component={OpportunityPage} />
            <Route path='/faculty/:id' component={FacultyPage} />
            <Route path='/application/:id' component={ApplicationPage} />
            <Route exact path='/newopp' component={CreateOpportunityForm} />
            <Route path='/editopp' component={EditOpportunityForm} />
            <Route exact path='/instructorRegister' component={InstructorRegister} />
            <Route exact path='/StudentRegister' component={StudentRegister} />
            <Route exact path='/professorDashboard' component={ProfessorDashboard} />
            <Route exact path='/professorView' component={ProfessorView} />
            <Route path = '/doc/:id' component={Doc} />
            <Route exact path='/editProfile' component={EditProfile} />
            <Route exact path='/facultySearch' component={FacultySearch} />
            <Route exact path='/' component={LandingPage} />
            <Route path='/*' component={Error} />
        </Switch>
    </BrowserRouter>, document.getElementById('root')
);