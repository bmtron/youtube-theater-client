import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { Link } from 'react-router-dom'
const endpoint = "http://localhost:8000"
const socket = socketIOClient(endpoint);



export default class TestRoute extends Component {
    constructor(props){
        super(props);
        this.state = {
            response: [],
            input: '',
            message: '',
            source: '',
            sourceInput: '',
            welcome: ''
        }
        socket.on('receive code', (payload) => {
            this.updateCodeFromSockets(payload)
        })
        socket.on('update vid', (payload) => {
            this.updateVidSource(payload)
        })
    }
    handleChange = (e) => {
        this.setState({
            input: e.target.value
        })
    }
    updateVidSource(payload) {
        this.setState({
            source: payload
        })
    }
    updateCodeFromSockets(payload) {
        this.setState({
            response: [...this.state.response, payload]
        })
    }
    parseYoutubeLink(vid) {
        let newLink = vid.replace('watch?v=', 'embed/');
        return newLink;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log('clicked');
        this.setState({
            message: this.state.input
        })
        socket.emit('coding event', {
            room: this.props.room,
            newCode: this.state.input
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
        socket.emit('room', {room: room})
        socket.on('message', payload => {
            this.setState({
                welcome: payload
            })
        })
      }
    componentWillUnmount() {
        socket.emit('leave room', {
            room: this.props.room
        })
    }
    render() {
        console.log(this.props.room)
        return (
            <div>
                <h3>Welcome to room {this.props.room}</h3>
                {this.state.response.length > 0 ? <ul>{this.state.response.map((item, index) => {
                    return <li key={index}>{item.newCode}</li>
                })}</ul> : <p>Loading...</p>}
                <input name="test" id="test" value={this.state.input} onChange={(e) => this.handleChange(e)} />
                <button type="submit" onClick={(e) => this.handleSubmit(e)}>Submit</button>
                <div>
                   {this.state.source === '' ? <p></p> :  <iframe width="560" title="vid" height="315" src={this.state.source.source + "?playsinline=1?origin=https://bmmeehan3-youtube-app.now.sh&autoplay=1"} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; fullscreen;"></iframe>}
                </div>
                <input name="vid" id="vid" value={this.state.sourceInput} onChange={(e) => this.handleSourceChange(e)}/>
                <button type="submit" onClick={(e) => this.handleSubmitVideo(e)}>New Video</button>
                <Link to='/main'><button>Home</button></Link>
            </div>
        )
    }
}