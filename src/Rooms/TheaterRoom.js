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
            sourceSent: false,
            hide: 'hidden'
        }
        socket.on('receive message', (payload) => {
            this.updateMessageFromSockets(payload)
            this.stayScrolledToBottom();
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
            source: payload,
            hide: payload.hide
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
            source: this.parseYoutubeLink(this.state.sourceInput),
            hidden: 'notHidden'
        })
        this.setState({
            sourceInput: '',
            hide: 'notHidden'
        })
    }
    updateSource = (e) => {
        e.preventDefault();
        this.setState({
            sourceInput: e.target.value
        })
    }
    disableSubmit() {
        if (this.state.sourceInput.length === 0 ) {
            return false
        }
        if (!this.state.sourceInput.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/)) {
            return false;
        }
        else {
            return true;
        }
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
    showPlayer = () => {
            this.setState({
                hide: 'notHidden'
            })
    }
    stayScrolledToBottom() {
        let chat = document.getElementById('chat');
        chat.scrollTop = chat.scrollHeight;
    }
    submitChat = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            this.handleSubmitMessage(e)
        }
    }
    render() {

        return (
            <div className="room_page">
                <nav className="room_nav">
                    <h2 className="theater_h2">Theater Room {this.props.room}</h2>
                    <section className="nav_buttons">
                        <LogoutButton />
                        <Link to='/main'><button className="home_button">Home</button></Link>
                    </section>
                </nav>
                <section className="room_main_content">
                    <section className="video">
                        <div className="blank"></div>
                        {this.state.source === '' ? <p className="instructions">Submit a YouTube link below to start sharing videos!</p> : null}
                        <div id='player' className={this.state.hide}>
                            {this.state.source === '' ? <p></p>:  <iframe width="100%" title="vid" height="100%" id="iframe" src={this.state.source.source + "?playsinline=1?origin=https://localhost:3000&autoplay=1&controls=1&enablejsapi=1"} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; fullscreen;"></iframe>}
                        </div>
                        <section className="vid_controls">
                            <input name="vid" id="vid" value={this.state.sourceInput} placeholder="Enter YouTube URL here!" onChange={(e) => this.updateSource(e)}/>
                            <button className="submit" type="submit" disabled={!this.disableSubmit()} onClick={(e) => this.handleSubmitVideo(e)}>Submit Video</button>
                            <section className="pause_play">
                                <button className="pause" onClick={() => this.togglePause(this.state.paused)}>Pause</button>
                                <button className="play" onClick={() => this.togglePlay(this.state.paused)}>Resume</button>
                            </section>
                        </section>
                    </section>
                    <section className="chat_box">
                        <ul id="chat" className="chat">{this.state.message.length ? this.state.message.map((item, index) => {
                            return <li key={index}>{item}</li> }) : null}
                        </ul>
                        <form id="message_box" className="message_box" onSubmit={(e) => this.handleSubmitMessage(e)}>
                            <textarea name="chat_message" id="chat_message" onKeyDown={e => this.submitChat(e)} className="chat_message" value={this.state.input} onChange={(e) => this.handleChange(e)} />
                            <button type="submit" className="chat_button">Chat</button>
                        </form>
                    </section>
                </section>
            </div>
        )
    }
}