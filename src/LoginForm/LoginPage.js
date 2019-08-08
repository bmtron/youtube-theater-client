import React, { Component } from 'react'
import LoginForm from './LoginForm'

export default class LoginPage extends Component {
    static defaultProps = {
        history: {
            push: () => {}
        }
    }

    handleLoginSuccess = user => {
        const { history } = this.props
        history.push('/main')
    }
   
    render() {
        return (
            <div>
                <LoginForm onLoginSuccess={this.handleLoginSuccess}/>
            </div>
        )
    }
}