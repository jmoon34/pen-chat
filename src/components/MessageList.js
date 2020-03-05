import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'
import TypingIndicator from './TypingIndicator'

class MessageList extends React.Component {

	getSnapshotBeforeUpdate(){
		const node = ReactDOM.findDOMNode(this)
		this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 400 >= node.scrollHeight
		return null
	}

	componentDidUpdate(){
		if(this.shouldScrollToBottom){
			const node = ReactDOM.findDOMNode(this)
			node.scrollTop = node.scrollHeight
		}
	}

	render() {
		/* Not subscribed to any room.  Display "Join a room"*/
		if(!this.props.roomId){
			return(
				<div className="message-list">
					<div className="join-room">
						&larr; Join a room!
					</div>
				</div>
			)
		}
		/* Subscribed to a room, display the messages and notifications */
		return (
			<div className="message-list">
				{this.props.messages.map((message, index) => {
					return (
						<Message key={index} 
							username={message.senderId} 
							text={message.parts[0].payload.content}
							time={message.createdAt}/>
					)
				})}
				<TypingIndicator typingUsers={this.props.typingUsers}/>
			</div>
		)
	}
}

export default MessageList
