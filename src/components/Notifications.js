import React from 'react'
import { uniqueId } from 'underscore'

function Notifications(props) {
	const statements = props.notification.map((element, index) => {
		if(index === 0){
			return <li key={uniqueId()}>{element.statement}</li>
		} else{
			return <li key={uniqueId()}>, {element.statement}</li>
		}
	})

	return( 
		<div className="notifications">
			<ul>
				{statements}
			</ul>
		</div>
	)
}

export default Notifications
