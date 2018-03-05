import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import flow from 'lodash.flow'
import isEqual from 'lodash.isequal'

import PhoneNumber from './PhoneNumber'

class EditContact extends Component {
	constructor (props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			phoneNumbers: []
		}
		this.addPhoneNumber = this.addPhoneNumber.bind(this);
		this.saveContact = this.saveContact.bind(this);
		this.onNumberChange = this.onNumberChange.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onPhoneNumberDelete = this.onPhoneNumberDelete.bind(this);
		this.renderPhoneNumber = this.renderPhoneNumber.bind(this);
		
	}

	componentWillReceiveProps(nextProps) {
		console.log('--->', nextProps)

		if (nextProps.contactQuery.loading || nextProps.phoneNumbersQuery.loading) return;

		this.setState({
			firstName: nextProps.contactQuery.contact.firstName,
			lastName: nextProps.contactQuery.contact.lastName,
			phoneNumbers: (nextProps.phoneNumbersQuery.phoneNumbers) ? nextProps.phoneNumbersQuery.phoneNumbers : []
		});
	}

	addPhoneNumber() {
		this.setState({
			phoneNumbers: [...this.state.phoneNumbers, {
				phoneNumber: '',
				label: ''
			}]
		});
	}

	onNumberChange (value, index) {
		const phoneNumbers = [...this.state.phoneNumbers];
		const newPhoneNumber = Object.assign({}, phoneNumbers[index], { phoneNumber: value });
		phoneNumbers[index] = newPhoneNumber;
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	onLabelChange (value, index) {
        const phoneNumbers = [...this.state.phoneNumbers];
        const newPhoneNumber = Object.assign({}, phoneNumbers[index], { label: value });
        phoneNumbers[index] = newPhoneNumber;
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	onPhoneNumberDelete (index) {
		const phoneNumbers = [...this.state.phoneNumbers];
		phoneNumbers.splice(index, 1);
		this.setState({
			phoneNumbers: phoneNumbers
		});
	}

	saveContact = async () => {
		const contactId = this.props.match.params.id
		await this.props.updateContactMutation({
			variables: {
				contactId,
				firstName: this.state.firstName,
				lastName: this.state.lastName
			}
		});
		this.props.phoneNumbersQuery.phoneNumbers.map(storedPhoneNumber => {
			// if phone number is not in state -> delete
			const localPhoneNumber = this.state.phoneNumbers.find(localPhoneNumber => localPhoneNumber.id === storedPhoneNumber.id)
			if (!localPhoneNumber) {
				this.props.deletePhoneNumberMutation({
					variables: {
						id: storedPhoneNumber.id
					},
                    refetchQueries: [{ query: PHONE_NUMBERS_QUERY, variables: { contactId }}]
				})
			} else { // if phone number is not the same -> update
				if (!isEqual(storedPhoneNumber, localPhoneNumber)) {
                    this.props.updatePhoneNumberMutation({
						variables: {
							id: localPhoneNumber.id,
							phoneNumber: localPhoneNumber.phoneNumber,
							label: localPhoneNumber.label,
                            contactId
						},
                        refetchQueries: [{ query: PHONE_NUMBERS_QUERY, variables: { contactId }}]
                    });
				}
			}
		})
        this.props.history.push('/')
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
				<button className="mb2" onClick={() => this.addPhoneNumber()}>Add phone number</button>
				<div>{this.state.phoneNumbers.map(this.renderPhoneNumber)}</div>
				<button className="mb2" onClick={() => this.saveContact()}>Save</button>
			</div>
		)
	}
}

const CONTACT_QUERY = gql`
  query ContactQuery($contactId: ID!) {
    contact(id: $contactId) {
      id
      firstName
      lastName
    }
  }
`

const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContactMutation($contactId: ID!, $firstName: String, $lastName: String) {
    updateContact(id: $contactId, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`

const PHONE_NUMBERS_QUERY = gql`
  query PhoneNumbersQuery($contactId: ID!) {
    phoneNumbers(contactId: $contactId) {
      id
      phoneNumber
      label
      contactId
    }
  }
`

const UPDATE_PHONE_NUMBER_MUTATION = gql`
  mutation UpdatePhoneNumberMutation($id: ID!, $firstName: String, $lastName: String, $contactId: ID!) {
    updatePhoneNumber(id: $id, firstName: $firstName, lastName: $lastName, contactId: $contactId) {
      id
      firstName
      lastName
      contactId
    }
  }
`

const DELETE_PHONE_NUMBER_MUTATION = gql`
  mutation DeletePhoneNumberMutation($id: ID!) {
    deletePhoneNumber(id: $id) {
      id
      phoneNumber
      label
      contactId
    }
  }
`

const contactQuery = graphql(CONTACT_QUERY, {
	name: 'contactQuery',
	options: ownProps => {
		const contactId = ownProps.match.params.id;
		return {
			variables: {contactId}
		}
	}
});

const phoneNumbersQuery = graphql(PHONE_NUMBERS_QUERY, {
	name: 'phoneNumbersQuery',
	options: ownProps => {
		const contactId = ownProps.match.params.id;
		return {
			variables: {contactId}
		}
	}
});

const updateContactMutation = graphql(UPDATE_CONTACT_MUTATION, {
	name: 'updateContactMutation',
	options: ownProps => {
		const contactId = ownProps.match.params.id;
		return {
			variables: { contactId }
		}
	}
});

const updatePhoneNumberMutation = graphql(UPDATE_PHONE_NUMBER_MUTATION, {
	name: 'updatePhoneNumberMutation'
});

const deletePhoneNumberMutation = graphql(DELETE_PHONE_NUMBER_MUTATION, {
	name: 'deletePhoneNumberMutation'
});

export default flow(
    withRouter,
	contactQuery,
	phoneNumbersQuery,
	updateContactMutation,
    updatePhoneNumberMutation,
    deletePhoneNumberMutation
)(EditContact);