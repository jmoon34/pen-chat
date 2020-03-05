import React from 'react'


function Message(props) {
	return(
		<div className="message">
			<div className="message-username">{props.username}</div>
			<div className="message-text">{props.text}</div>
			<div className="message-time">sent: {props.time}</div>
		</div>
	)
}

export default Message
