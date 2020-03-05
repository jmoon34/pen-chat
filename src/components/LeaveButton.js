import React from 'react'


function LeaveButton(props) {
	if(props.disabled){
		return null
	}
	return(
		<button 
			className="leave-room-button"
			onClick={props.leaveRoom}>
			Leave Room
		</button>
	)
}

export default LeaveButton
