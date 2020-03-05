import React from 'react';
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import RoomList from './RoomList'
import NewRoomForm from './NewRoomForm'
import Notifications from './Notifications'
import { Notification } from './Notification'
import LeaveButton from './LeaveButton'
import OnlineList from './OnlineList'
import '../style.css';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { tokenUrl, instanceLocator } from './config'


class App extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			typingUsers: [],
			roomMemberIds: [],
			memberStatus: {},
			notification: [],
			currentRoom: {},
			currentUser: {},
			messages: [],
			joinableRooms: [],
			joinedRooms: []
		}
		this.sendMessage = this.sendMessage.bind(this)
		this.subscribeToRoom = this.subscribeToRoom.bind(this)
		this.getRooms = this.getRooms.bind(this)
		this.createRoom = this.createRoom.bind(this)
		this.leaveRoom = this.leaveRoom.bind(this)
		this.createNotification = this.createNotification.bind(this)
		this.sendTypingEvent = this.sendTypingEvent.bind(this)
		this.getRoomMembers = this.getRoomMembers.bind(this)
	}

	componentDidMount(){
		const chatManager = new ChatManager({
			instanceLocator,
			userId: this.props.currentUsername,
			tokenProvider: new TokenProvider({
				url: tokenUrl
			})
		})

		chatManager.connect()
			.then(currentUser => {
				this.setState ({ currentUser }) 
				this.getRooms()
			})
			.catch(err => console.log('error on connecting: ', err))
	}

	getRooms(){
		this.state.currentUser.getJoinableRooms()
			.then(joinableRooms => {
				const fixedRooms = this.state.currentUser.rooms.filter(room => room.name !== undefined)
				this.setState({
					joinableRooms,
					joinedRooms: fixedRooms
				})
			})
			.catch(err => console.log('error on joinableRooms: ', err))
	}

	getRoomMembers(){
		this.setState({
			roomMemberIds: this.state.currentRoom.userIds,
			memberStatus: this.state.currentUser.presenceStore
		})
	}

	createRoom(name){
		this.state.currentUser.createRoom({
			name,
		})
		.then(room => this.subscribeToRoom(room.id))
		.catch(err => console.log('error on creating room: ', err))
	}

	leaveRoom(){
		this.state.currentUser.leaveRoom({ roomId: this.state.currentRoom.id })
			.then(room => {
				this.setState({
					joinedRooms: this.state.joinedRooms.filter(
						joinedRoom => joinedRoom !== room
					)
				})
				if(this.state.currentUser.rooms.length > 1){
					this.subscribeToRoom(this.state.joinedRooms[0].id)
				}else{
					this.setState({
						currentRoom: {}
					})
				}
				this.getRooms()
			})
			.catch(err => {
				console.log(`Error leaving room ${this.state.currentRoom}: ${err}`)
			})
	}

	subscribeToRoom(roomId){
		this.setState({ 
			messages: [],
			notification: [],
			memberStatus: {}
		})

		this.state.currentUser.subscribeToRoomMultipart({
			roomId,
			messageLimit: 50,
			hooks: {
				onMessage: message => {
					this.setState({ messages: [...this.state.messages, message] })
				},
				// Create notification when user joins room
				onUserJoined: user => {
					if(this.state.currentRoom.id === roomId){
						this.createNotification(user, "joined")
					}
				},
				// Create notification when user leaves room
				onUserLeft: user => {
					if(this.state.currentRoom.id === roomId){
						this.createNotification(user, "left")
					}
				},
				// Notification when user online status changes
				onPresenceChanged: (state, user) => {
					if(state["current"] === "online" && state["previous"] === "offline" && user.name !== this.state.currentUser.name){
						this.createNotification(user, "online")
					}else if((state["current"] === "offline" || state["current"] === "unknown") && 
						state["previous"] === "online"){
						this.createNotification(user, "offline")
					}
				},
				onUserStartedTyping: user => {
					this.setState({ typingUsers: [...this.state.typingUsers, user.name] })
				},
				onUserStoppedTyping: user => {
					this.setState({
						typingUsers: this.state.typingUsers.filter(
							username => username !== user.name
						)
					})
				}
			}
		})
			.then(room => {
				this.setState({
					currentRoom: room,
				})
				console.log(this.state.currentUser)
				this.getRoomMembers()
				this.getRooms()
			})
			.catch(err => console.log('error on subscribing to room: ', err))
	}

	createNotification(user, type){
		let next;
		if(type === "joined"){
			next = new Notification(user, type, `${user.name} has joined the room`)
		}else if(type === "left"){
			next = new Notification(user, type, `${user.name} has left the room`)
		}else if(type === "online"){
			next = new Notification(user, type, `${user.name} has come online`)
		}else if(type === "offline"){
			next = new Notification(user, type, `${user.name} has gone offline`)
		}
		this.setState({ notification: [...this.state.notification, next] })
		setTimeout(() => {
			if(this.state.notification.length > 1){
				this.setState({ notification: this.state.notification.slice(1)})
			}else{
				this.setState({ notification: [] })
			}
		}, 5000)
	}

	sendMessage(text){
		this.state.currentUser.sendMessage({
			text,
			roomId: this.state.currentRoom.id
		})
	}

	sendTypingEvent(){
		this.state.currentUser
			.isTypingIn({ roomId: this.state.currentRoom.id })
			.catch(err => console.log('Typing event error ', err))
	}


	render(){
		return (
			<div className="app">
				<RoomList 
					roomId={this.state.currentRoom.id}
					subscribeToRoom={this.subscribeToRoom}
					joinableRooms={[...this.state.joinableRooms]}
					joinedRooms={[...this.state.joinedRooms]}/>
				<OnlineList
					memberStatus={this.state.memberStatus}
					memberIds={this.state.roomMemberIds}/>
				<MessageList 
					typingUsers={this.state.typingUsers}
					roomId={this.state.currentRoom.id}
					messages={this.state.messages}/>
				<LeaveButton 
					disabled={!this.state.currentRoom.name}
					leaveRoom={this.leaveRoom}/>
				<Notifications
					notification={this.state.notification}/>
				<SendMessageForm 
					sendTypingEvent={this.sendTypingEvent}
					disabled={!this.state.currentRoom.name}
					sendMessage={this.sendMessage}/>
				<NewRoomForm createRoom={this.createRoom}/>
			</div>
		);
	}
}


export default App;
