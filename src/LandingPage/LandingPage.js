import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default class LandingPage extends Component {
    render() {
        return (
            <div className="landing_page">
                    <section className="logo">
                        <img src="https://i.gyazo.com/33bcc7dccb83a8d95d944ad64f0c5895.png" height="100%" width="100%" alt="WeTube logo" />
                    </section>
                <section className="landing_container">
                    <h2 className="welcome">Welcome to WeTube!</h2>
                    <p>The interactive platform for sharing your favorite YouTube videos with all of your friends,</p>
                    <p className="emphasis_p">in real time!</p>
                    <p className="midp">Just enter any of the available theater rooms, grab a link to your favorite
                        youtube video, and submit!
                    </p>
                    <section className="mainpage_screenshot">
                        <img height="100%" width="100%" src="https://i.gyazo.com/f2b64c71480cdaab23308045fee25718.png" alt="A screenshot of the main page of WeTube" />
                    </section>
                    <p className="midp">Everyone in the room will be able to view the video in real-time, as well as pause
                        and resume the video for everyone in the room!
                    </p>
                    <p className="midp">Have some interesting thoughts or reactions? Share them with your friends using WeTube's built-in chat!</p>
                    <section className="mainpage_screenshot">
                        <img height="100%" width="100%" src="https://i.gyazo.com/913809faa06be9f85862e48f0014e997.png" alt="A screenshot of the room chat function!" />
                    </section>
                    <p>Already have an account? Click the button below to log in!</p>
                    <Link to='/login'><button className="login_link">Login</button></Link>
                    <p>New user? Click the registration button below to get started!</p>
                    <Link to='/register'><button className="register_link">Register</button></Link>
                </section>
            </div>
        )
    }
}