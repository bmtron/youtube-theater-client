import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../LogoutButton/LogoutButton';
import ValidationError from '../Utils/ValidationError';
import './MainPage.css';

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: [1, 2],
            error: null,
            roomName: '',
            roomNameValid: false,
            validationMessages: {
                roomName: ''
            }
        }
    }
    handleCreateRoom = ev => {
        ev.preventDefault();
        const {create_room} = ev.target

        const room = {
            name: create_room.value
        }
        fetch('https://agile-ravine-21756.herokuapp.com/api/rooms', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(room)
        })
        .then(res => {
            if(!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            else {
                this.setState({
                    rooms: [...this.state.rooms, room]
                })
                return res.json()
            }
        }
        )
        .catch(err => {
            this.setState({
                error: err
            })
        })
        this.setState({
            roomName: ''
        })
    }
    componentDidMount() {
        fetch('https://agile-ravine-21756.herokuapp.com/api/rooms', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.setState({
                rooms: resJson
            })
        })
        .catch(err => {
            this.setState({
                error: err
            })
        })
    }
    validateRoomName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages}
        let hasError = false;

        const roomName = fieldValue.trim();

        if(roomName.length === 0 || roomName.length > 25) {
            fieldErrors.roomName = 'Room name must be greater than 0 and less than 25 characters.';
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            roomNameValid: !hasError
        })
    }
    updateRoomName(roomName) {
        this.setState({roomName}, () => {this.validateRoomName(roomName)})
    }
    render() {
        return (
            <div>
                <nav className="main_nav">
                    <h2 className="site_title">WeTube</h2>
                    <LogoutButton />
                </nav>

                <section className="main_page_main">
                    <section className="main_directions">
                        <h2>Welcome to WeTube!</h2>
                        <p>Select a room to join below, or create your own!</p>
                    </section>
                    <form className="create_room" onSubmit={this.handleCreateRoom}>
                        <label htmlFor="create_room">Room Name</label>
                        <input name="create_room" id="create_room" type="text" value={this.state.roomName} onChange={e => this.updateRoomName(e.target.value)}/>
                        {this.state.error === null ? null : <p>{this.state.error.error}</p>}
                        <ValidationError className="error" hasError={!this.state.roomNameValid} message={this.state.validationMessages.roomName}/>
                        <button className="create_button" disabled={!this.state.roomNameValid}>Create Room</button>
                    </form>
                    <section className="rooms_container">
                    <h2 className="room_label">Available Rooms</h2>
                        {this.state.rooms !== null ? this.state.rooms.map((item, index) => {
                            return <Link key={index} to={`/rooms/${item.name}`}><button className="room_button">Room {item.name}</button></Link>
                        }) : null}
                    </section>
                </section>
            </div>
        )
    }
}