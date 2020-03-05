import React from 'react'

class SendMessageForm extends React.Component{

	constructor(){
		super()
		this.state = {
			message: ''
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit= this.handleSubmit.bind(this)
	}

	handleChange(e){
		this.props.sendTypingEvent()
		this.setState({
			message: e.target.value
		})
	}

	handleSubmit(e){
		e.preventDefault()
		this.props.sendMessage(this.state.message)
		this.setState({
			message: ''
		})
	}

	render(){
		if(this.props.disabled){
			return null
		} else{
			return(
				<form 
					onSubmit={this.handleSubmit}
					className="send-message-form" action="">
					<input
						onChange={this.handleChange}
						value={this.state.message}
						type="text" 
						placeholder="Send Message" />
				</form>
			)
		}
	}
}

export default SendMessageForm
