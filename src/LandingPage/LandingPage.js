import React, { Component } from 'react';
import {Route, Link } from 'react-router-dom';

export default class LandingPage extends Component {
    render() {
        return (
            <div>
                <p>Landing Page</p>
                <Link to='/login'><button>Login</button></Link>
                <Link to='/register'><button>Register</button></Link>
            </div>
        )
    }
}