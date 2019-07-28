import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: [1, 2],
            error: null
        }
    }
    handleCreateRoom = ev => {
        ev.preventDefault();
        const {create_room} = ev.target

        const room = {
            name: create_room.value,
            password: 'blank'
        }
        this.setState({
            rooms: [...this.state.rooms, room]
        })
        fetch('http://localhost:8000/api/rooms', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(room)
        })
        .then(res => 
            (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        )
        .then(res => {
            create_room.value = ''
        })
        .catch(err => {
            this.setState({
                error: err
            })
        })
    }
    componentDidMount() {
        fetch('http://localhost:8000/api/rooms', {
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
            console.log(resJson)
        })
        .catch(err => {
            this.setState({
                error: err
            })
        })
    }
    render() {
        return (
            <div>
                {this.state.rooms !== null ? this.state.rooms.map((item, index) => {
                    return <Link key={index} to={`/rooms/${item.name}`}><button>Room {item.name}</button></Link>
                }) : null}
                <form className="create_room" onSubmit={this.handleCreateRoom}>
                    <label htmlFor="create_room">Room Name</label>
                    <input name="create_room" id="create_room" type="text"/>
                    <button>Create Room</button>
                </form>
            </div>
        )
    }
}