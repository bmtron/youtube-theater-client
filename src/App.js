import React, { Component } from 'react';
import LoginPage from './LoginForm/LoginPage';
import MainPage from './MainPage/MainPage';
import RegistrationPage from './RegistrationForm/RegistrationPage';
import LandingPage from './LandingPage/LandingPage';
import PublicRoute from './Utils/PublicRoute';
import PrivateRoute from './Utils/PrivateRoute'
import RoomPage from './Rooms/RoomPage';
import './App.css';


class App extends Component {
 
  render() {
    return (
      <div className="App">
        <PublicRoute exact path='/' component={LandingPage}/>
        <PublicRoute path='/login' component={LoginPage}/>
        <PublicRoute path='/register' component={RegistrationPage}/>
        <PrivateRoute path='/main' component={MainPage}/>
        <PrivateRoute path='/rooms/:room_id' component={RoomPage}/>
        
      </div>
    );
  }
}

export default App;
