import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class EditContact extends Component {
	constructor (props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: ''
		}
		this.getContact = this.getContact.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		console.log('--->', nextProps)
		this.setState({
			firstName: nextProps.contactQuery.contact.firstName,
			lastName: nextProps.contactQuery.contact.lastName
		})
	}

	getContact = async () => {
		const contactId = this.props.match.params.id
		await this.props.contactQuery({
			variables: {
				contactId
			}
		})
	}
	
	render() {
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

export default graphql(CONTACT_QUERY, {
	name: 'contactQuery',
	options: ownProps => {
		const contactId = ownProps.match.params.id;
		return {
			variables: { contactId }
		}
	}
}) (EditContact)