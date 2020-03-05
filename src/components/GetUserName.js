import React, { Component } from 'react'

class GetUserName extends Component {
	constructor(props){
		super(props)
		this.state ={
			username: '',
		}
		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	onSubmit(e){
		e.preventDefault()
		this.props.onSubmit(this.state.username)
	}

	onChange(e){
		this.setState({ username: e.target.value })
	}

	render(){
		return(
			<div>
				<div>
					<h2>What do you want your username to be?</h2>
						<form onSubmit={this.onSubmit}>
							<input 
								type="text"
								value={this.state.username}
								placeholder="username"
								onChange={this.onChange}
							/>
							<input type="submit" />
						</form>
				</div>
			</div>
		)
	}
}

export default GetUserName