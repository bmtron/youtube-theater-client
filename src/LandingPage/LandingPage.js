import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default class LandingPage extends Component {
    render() {
        return (
            <div className="landing_page">
                <nav className="landing_nav">
                    <h2 className="wetube">WeTube</h2>
                </nav>
                <section className="landing_container">
                    <h2 className="welcome">Welcome to WeTube!</h2>
                    <p>The interactive platform for sharing your favorite YouTube videos with all of your friends,</p>
                    <p className="emphasis_p">in real time!</p>
                    <p className="midp">Just enter any of the available theater rooms, grab a link to your favorite
                        youtube video, and submit!
                    </p>
                    <p className="midp">Everyone in the room will be able to view the video in real-time, as well as pause
                        and resume the video for everyone in the room!
                    </p>
                    <p className="midp">There's also a live chat to share your thoughts and reactions with your friends!</p>
                    <p>Already have an account? Click the button below to log in!</p>
                    <Link to='/login'><button className="login_link">Login</button></Link>
                    <p>New user? Click the registration button below to get started!</p>
                    <Link to='/register'><button className="register_link">Register</button></Link>
                    <p className="demop">Give the app a try!</p>
                    <p className="midp">Login to the demo account with the following credentials:</p>
                    <p className="userp">Username: testTube</p>
                    <p className="midp">Password: Testpass!1</p>
                </section>
            </div>
        )
    }
}