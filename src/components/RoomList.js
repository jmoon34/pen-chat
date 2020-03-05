import React from 'react'
import { uniqueId } from 'underscore'

class RoomList extends React.Component{

	roomSort(a, b){
		if(a.id < b.id) { return -1; }
		if(a.id > b.id) { return 1; }
		return 0;
	}	
	
	render(){
		const orderedJoinedRooms = [...this.props.joinedRooms].sort(this.roomSort)
		const orderedJoinableRooms = [...this.props.joinableRooms].sort(this.roomSort)
		return(
			<div className="rooms-list">
				<ul>
				<h3>Joined Rooms:</h3>
					{orderedJoinedRooms.map(room => {
						let active = ""
						if(this.props.roomId){
							active = this.props.roomId === room.id ? "active" : "";
						}
						return(
							<li key={uniqueId()} className={"room " + active}>
								<a onClick={() => this.props.subscribeToRoom(room.id)}
									href="#">
									# {room.name}
								</a>
							</li>
						)
					})}
				<h3>Joinable Rooms:</h3>
					{orderedJoinableRooms.map(room => {
						return(
							<li key={uniqueId()} className="room">
								<a onClick={() => this.props.subscribeToRoom(room.id)}
									href="#">
									# {room.name}
								</a>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

export default RoomList
