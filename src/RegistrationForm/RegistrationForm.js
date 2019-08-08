import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import ValidationError from '../Utils/ValidationError';
import './RegistrationForm.css';

export default class RegistrationForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            user_name: '',
            password: '',
            repeatPassword: '',
            validationMessages: {
                user_name: '',
                password: '',
                repeatPassword: ''
            },
            userNameValid: false,
            passwordValid: false,
            repeatPasswordValid: false,
            formValid: false
    
        }
    }
    formValid() {
        let valid = this.state.userNameValid && this.state.passwordValid && this.state.repeatPasswordValid;
        this.setState({
            formValid: valid
        })
    }
    updateUserName(user_name) {
        this.setState({user_name}, () => {this.validateUserName(user_name)});
    }
    updatePassword(password) {
        this.setState({password}, () => {this.validatePassword(password)});
    }
    updateRepeatPassword(repeatPassword) {
        this.setState({repeatPassword}, () => {this.validateRepeatPassword(repeatPassword)});
    }
    validateUserName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages}
        let hasError = false;
        

        const username = fieldValue.trim();

        if(username.length === 0) {
            fieldErrors.user_name = 'Username is required';
            hasError = true
        }
        else {
            fieldErrors.user_name = '';
            hasError = false;
        }
        this.setState({
            validationMessages: fieldErrors,
            userNameValid: !hasError
        }, this.formValid)
    }
    validatePassword(pass) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
        pass = pass.trim();

        const password = pass;
        if (password.length === 0) {
            fieldErrors.password = 'Password is required.'
            hasError = true;
        }
        else if (password.length < 8 || password.length > 36) {
            fieldErrors.password = 'Password must be between 8 and 36 characters';
            hasError = true;
        }
        else if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/)) {
            fieldErrors.password = 'Password must contain at least a lowercase letter, an uppercase letter, a number, and a special character';
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            passwordValid: !hasError
        }, this.formValid)
    }
    validateRepeatPassword(rpass) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const repeatPassword = rpass.trim();
        const password = this.state.password.trim();

        if (repeatPassword !== password) {
            fieldErrors.repeatPassword = 'Passwords do not match.'
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            repeatPasswordValid: !hasError
        }, this.formValid)
    }
    handleSubmit = ev => {
        ev.preventDefault()
        const user_name = this.state.user_name;
        const password = this.state.password;

        this.setState({
            error: null
        })
        const user = {
            user_name: user_name,
            password: password
        }
        console.log(user)
        fetch('https://agile-ravine-21756.herokuapp.com/api/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => 
            (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        )
        .then(user => {
           this.setState({
              user_name: '',
              password: '',
              repeatPassword: ''
           })
            this.props.onRegistrationSuccess()
        })
        .catch(res => {
            this.setState({ error: res.error})
        })
        
    }
    
    render() {

        return (
            <div className="Registration_form_div">
                <nav>
                    <h2 className="register_h2">WeTube</h2>
                </nav>
                <h2 className="register_title">Register for a WeTube account!</h2>
                <section className="reg_form_container">
                    <form className="registration_form" onSubmit={this.handleSubmit}>

                        <label htmlFor="reg_user_name">Username</label>
                        <input name="reg_user_name" id="register_user_name" type="text" defaultValue={''} onChange={e => this.updateUserName(e.target.value)}/>
                        <ValidationError hasError={!this.state.userNameValid} message={this.state.validationMessages.user_name}/>
                        {this.state.error === null ? null : <p>{this.state.error}</p>}

                        <label htmlFor="reg_user_pass">Password</label>
                        <input name="reg_user_pass" id="register_user_pass" type="password" onChange={(e) => this.updatePassword(e.target.value)}/>
                        <ValidationError hasError={!this.state.passwordValid} message={this.state.validationMessages.password}/>

                        <label htmlFor="reg_user_repeat_pass">Repeat Password</label>
                        <input name="reg_user_repeat_pass" id="reg_user_repeat_pass" type="password" onChange={e => this.updateRepeatPassword(e.target.value)}/>
                        <ValidationError hasError={!this.state.repeatPasswordValid} message={this.state.validationMessages.repeatPassword}/>
                        <button 
                            className="register_submit"
                            type="submit" 
                            disabled={!this.state.formValid}>Register</button>
                    </form>
                    <p>Already have an account? Login below!</p>
                    <Link to="/login"><button className="login_link">Login</button></Link>
                </section> 
            </div>
        )
    }
}