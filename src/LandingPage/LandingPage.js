import React, { Component } from 'react';
import {Route, Link } from 'react-router-dom';

export default class LandingPage extends Component {
    render() {
        return (
            <div>Landing Page
            <Link to='/login'><button>Login</button></Link>
            </div>
        )
    }
}