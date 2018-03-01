import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import PhoneNumber from './PhoneNumber'

class EditContact extends Component {
	constructor (props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			phoneNumbers: []
		}
		this.getContact = this.getContact.bind(this);
		this.addPhoneNumber = this.addPhoneNumber.bind(this);
		this.saveContact = this.saveContact.bind(this);
		this.onNumberChange = this.onNumberChange.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onPhoneNumberDelete = this.onPhoneNumberDelete.bind(this);
		this.renderPhoneNumber = this.renderPhoneNumber.bind(this);
		
	}

	componentWillReceiveProps(nextProps) {
		console.log('--->', nextProps)
		this.setState({
			firstName: nextProps.contactQuery.contact.firstName,
			lastName: nextProps.contactQuery.contact.lastName
		});
	}

	addPhoneNumber() {
		const phoneNumbers = this.state.phoneNumbers;
		phoneNumbers.push({
			phoneNumber: '',
			label: ''
		});
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	saveContact () {

	}

	onNumberChange (value, index) {
		const phoneNumbers = this.state.phoneNumbers;
		phoneNumbers[index].phoneNumber = value;
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	onLabelChange (value, index) {
		const phoneNumbers = this.state.phoneNumbers;
		phoneNumbers[index].label = value;
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	onPhoneNumberDelete (index) {
		const phoneNumbers = this.state.phoneNumbers;
		phoneNumbers.splice(index, 1);
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	getContact = async () => {
		const contactId = this.props.match.params.id
		await this.props.contactQuery({
			variables: {
				contactId
			}
		});
	}
	
	renderPhoneNumber (phoneNumber, i) {
		return (
			<PhoneNumber 
				key={i} 
				index= {i} 
				data={phoneNumber} 
				onNumberChange={this.onNumberChange} 
				onLabelChange={this.onLabelChange} 
				onDelete={this.onPhoneNumberDelete}
			/>
		)
	}
	
	render () {
		if (this.props.contactQuery && this.props.contactQuery.loading) {
			return <div>Loading</div>
		}

		if (this.props.contactQuery && this.props.contactQuery.error) {
			return <div>Error</div>
		}
		return (
			<div className="column">
				<input
					className="mb2"
					value={this.state.firstName}
					onChange={e => this.setState({ firstName: e.target.value })}
					type="text"
					placeholder="First name"
				/>
				<input
					className="mb2"
					value={this.state.lastName}
					onChange={e => this.setState({ lastName: e.target.value })}
					type="text"
					placeholder="Last name"
				/>
				<button onClick={() => this.addPhoneNumber()}>Add phone number</button>
				<div>{this.state.phoneNumbers.map(this.renderPhoneNumber)}</div>
				<button onClick={() => this.saveContact()}>Save Contact</button>
			</div>
		)
	}
}

const CONTACT_QUERY = gql`
  query ContactQuery($contactId: ID!) {
    contact(id: $contactId) {
      firstName
      lastName
    }
  }
`

const UPDATE_CONTACT_MUTATION = gql`
  query UpdateContactMutation($contactId: ID!, $firstName: String, $lastName: String, $phoneNumbers: [String!]) {
    updateContact(id: $contactId, firstName: $firstName, lastName: $lastName, phoneNumbers: $phoneNumbers) {
      id
      firstName
      lastName
      phoneNumbers
    }
  }
`

export default graphql(CONTACT_QUERY, {
	name: 'contactQuery',
	options: ownProps => {
		const contactId = ownProps.match.params.id;
		return {
			variables: { contactId }
		}
	}
}) (graphql(UPDATE_CONTACT_MUTATION, {
	name: 'updateContactMutation',
    options: ownProps => {
        const contactId = ownProps.match.params.id;
        return {
            variables: {
            	contactId
            }
        }
    }
})(EditContact))