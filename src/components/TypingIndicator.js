import React from 'react'

class TypingIndicator extends React.Component{
	render(){
		if(this.props.typingUsers.length > 0) {
			return(
				<div>
					{`${this.props.typingUsers.slice().join(' and ')} is typing`}
				</div>
			)
		}
		return null
	}
}

export default TypingIndicator
