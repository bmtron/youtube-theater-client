import React, { Component } from 'react';

export default class RegistrationForm extends Component {
    state = {
        error: null
    }

    handleSubmit = ev => {
        ev.preventDefault()
        const {reg_user_name, reg_user_pass} = ev.target
        this.setState({
            error: null
        })
        const user = {
            user_name: reg_user_name.value,
            password: reg_user_pass.value
        }
        console.log(user)
        fetch('http://localhost:8000/api/users', {
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
            reg_user_name.value = ''
            reg_user_pass.value = ''
            this.props.onRegistrationSuccess()
        })
        .catch(res => {
            this.setState({ error: res.error})
        })
        
    }
    
    render() {
        return (
            <div className="Registration_form">

                <form className="registration_form" onSubmit={this.handleSubmit}>
                    <label htmlFor="reg_user_name">User Name</label>
                    <input name="reg_user_name" id="register_user_name" type="text" defaultValue={''}/>

                    <label htmlFor="reg_user_pass">Password</label>
                    <input name="reg_user_pass" id="register_user_pass" type="password" defaultValue={''}/>
                    {this.state.error !== null ? <p>{this.state.error}</p> : <p></p>}
                    <button type="submit">Register Account</button>
                </form>
            </div>
        )
    }
}