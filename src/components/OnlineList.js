import React from 'react'
import { uniqueId } from 'underscore'

//online: 1
//offline: 2
//unknown: 3

function sortList(propMemberIds, propMemberStatus){
	let memberIds = [...propMemberIds];
	let memberStatus = Object.assign({}, propMemberStatus)
	for (let member in memberStatus){
		if(memberStatus[member] === "online"){
			memberStatus[member] = 1;
		}else if(memberStatus[member] === "offline"){
			memberStatus[member] = 2;
		}else{
			memberStatus[member] = 3;
		}
	}

	let sortedMemberStatus = [];
	for (let i in memberIds){
		sortedMemberStatus.push([memberIds[i], memberStatus[memberIds[i]]]);
	}

	sortedMemberStatus.sort((a, b) => {
		return a[1] - b[1];
	})

	return sortedMemberStatus
}

function MList(props){
	const item = props.item
	let result=<h1>what</h1>;
	if(item[1] === 3){
		result = <li>{item[0]}: unknown</li>
	}else if(props.item[1] === 2){
		result = <li>{item[0]}: offline</li>
	}else if(props.item[1] === 1){
		result = <li>{item[0]}: online</li>
	}
	return result;
}

function OnlineList(props) {
	const sortedMemberStatus = sortList(props.memberIds, props.memberStatus)
	const onlineList = sortedMemberStatus.map(item=> {
		return <MList key={uniqueId()} item={item}/>
	})

	return( 
		<div className="online-list">
			<ul>
				{onlineList}
			</ul>
		</div>
	)
}

export default OnlineList 
