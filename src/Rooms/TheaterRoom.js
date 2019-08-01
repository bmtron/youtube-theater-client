import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { Link } from 'react-router-dom'
import LogoutButton from '../LogoutButton/LogoutButton';
import './TheaterRoom.css';

const endpoint = "https://agile-ravine-21756.herokuapp.com/";
const socket = socketIOClient(endpoint);


export default class TheaterRoom extends Component {
    constructor(props){
        super(props);
        this.state = {
            response: '',
            input: '',
            message: [],
            source: '',
            sourceInput: '',
            welcome: '',
            paused: null,
        }
        socket.on('receive message', (payload) => {
            this.updateMessageFromSockets(payload)
        })
        socket.on('update vid', (payload) => {
            this.updateVidSource(payload)
        })
        socket.on('pause vid', (payload) => {
            this.updatePauseState(payload)
        })
    }
    handleChange = (e) => {
        this.setState({
            input: e.target.value
        })
    }
    updatePauseState(payload) {
        this.setState({
            paused: payload.paused
        })
    }
    updateVidSource(payload) {
        this.setState({
            source: payload
        })
    }
    updateMessageFromSockets(payload) {
        this.setState({
            message: [...this.state.message, payload.newCode]
        })
    }
    parseYoutubeLink(vid) {
        let newLink = vid.replace('watch?v=', 'embed/');
        return newLink;
    }
    handleSubmitMessage = (e) => {
        e.preventDefault();
        console.log('clicked');
        socket.emit('message', {
            room: this.props.room,
            newCode: `${window.sessionStorage.getItem('user')}: ${this.state.input}`
        })
        this.setState({
            input: ''
        })
    }
    handleSubmitVideo = (e) => {
        e.preventDefault();
        socket.emit('video source', {
            room: this.props.room,
            source: this.parseYoutubeLink(this.state.sourceInput)
        })
    }
    handleSourceChange = (e) => {
        e.preventDefault();
        this.setState({
            sourceInput: e.target.value
        })
    }
    componentDidMount() {
       const room = this.props.room;
        socket.emit('room', {room: room, user: window.sessionStorage.getItem('user')})
        socket.on('welcome', payload => {
            this.setState({
                welcome: payload
            })
        })
        socket.on('join', payload => {
            this.setState({
                message: [...this.state.message, payload]
            })
        })
        
      }
    componentDidUpdate() {
        if (this.state.source === '') {
            return null;
        }
        else {
            this.checkForPause(this.state.paused)
        }
    }
    componentWillUnmount() {
        socket.emit('leave room', {
            room: this.props.room
        })
    }
    checkForPause(state) {
        let iframe = document.getElementById("iframe")
        if (state) {
            iframe.contentWindow.postMessage(JSON.stringify({event: 'command', func: 'pauseVideo'}), '*')
        }
        if (!state) {
            iframe.contentWindow.postMessage(JSON.stringify({event: 'command', func: 'playVideo'}), '*')
        }
    }

    togglePause = (state) => {

        socket.emit('pause', {
            room: this.props.room,
            paused: true
        })
    }
    togglePlay = (state) => {

        socket.emit('pause', {
            room: this.props.room,
            paused: false
        })
    }
    render() {
        console.log(this.state.message)
        return (
            <div className="room_page">
                <nav className="room_nav">
                    <LogoutButton />
                    <h3>Welcome to room {this.props.room}</h3>
                </nav>
                <section className="room_main_content">
                    <section className="video">
                        <div id='player'>
                            {this.state.source === '' ? <p></p> :  <iframe width="560" title="vid" height="315" id="iframe" src={this.state.source.source + "?playsinline=1?origin=https://localhost:3000&autoplay=1&enablejsapi=1"} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; fullscreen;"></iframe>}
                        </div>
                        <input name="vid" id="vid" value={this.state.sourceInput} onChange={(e) => this.handleSourceChange(e)}/>
                        <button type="submit" onClick={(e) => this.handleSubmitVideo(e)}>New Video</button>
                        <Link to='/main'><button>Home</button></Link>
                        <button onClick={() => this.togglePause(this.state.paused)}>Pause</button>
                        <button onClick={() => this.togglePlay(this.state.paused)}>Play</button>
                    </section>
                    <section className="chat_box">
                        <ul className="chat">{this.state.message.length ? this.state.message.map((item, index) => {
                            return <li key={index}>{item}</li> }) : null}
                        </ul>
                        <form className="message_box">
                            <input name="test" id="test" value={this.state.input} onChange={(e) => this.handleChange(e)} />
                            <button type="submit" onClick={(e) => this.handleSubmitMessage(e)}>Submit</button>
                        </form>
                    </section>
                </section>
            </div>
        )
    }
}