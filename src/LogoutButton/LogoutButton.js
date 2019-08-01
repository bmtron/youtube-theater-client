import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from '../services/TokenService';
import './LogoutButton.css';

export default class LogoutButton extends Component {
    handleLogoutClick = () => {
        TokenService.clearAuthToken()
      }
    render() {
        return (
            <Link to='/' onClick={() => this.handleLogoutClick()}><button className="logout_button">Logout</button></Link>
        )
    }
}