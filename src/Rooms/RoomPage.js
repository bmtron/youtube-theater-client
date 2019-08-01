import React, {Component} from 'react'
import TheaterRoom from './TheaterRoom'


export default class RoomPage extends Component {
    render() {
        return (
            <TheaterRoom room={this.props.match.params.room_id}/>
        )
    }
}