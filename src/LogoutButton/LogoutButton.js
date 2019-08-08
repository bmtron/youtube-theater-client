import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from '../services/TokenService';
import './LogoutButton.css';

export default class LogoutButton extends Component {
    handleLogoutClick = () => {
        TokenService.clearAuthToken()
        window.sessionStorage.removeItem('user');
      }
    render() {
        return (
            <Link to='/login' onClick={() => this.handleLogoutClick()}><button className="logout_button">Logout</button></Link>
        )
    }
}