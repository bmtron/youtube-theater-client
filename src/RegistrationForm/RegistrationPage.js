import React, { Component } from 'react'
import RegistrationForm from './RegistrationForm'

export default class RegistrationPage extends Component {
    static defaultProps = {
        history: {
            push: () => {}
        }
    }

    handleRegistrationSuccess = user => {
        const { history } = this.props
        history.push('/login')
    }

    render() {
        return (
            <div>
                <RegistrationForm onRegistrationSuccess={this.handleRegistrationSuccess} />
            </div>
        )
    }
}