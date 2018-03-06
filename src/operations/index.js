import gql from 'graphql-tag'

export const CONTACTS_QUERY = gql`
  query FeedQuery {
    feed {
      id
      firstName
      lastName
    }
  }
`

export const CONTACT_QUERY = gql`
  query ContactQuery($contactId: ID!) {
    contact(id: $contactId) {
      id
      firstName
      lastName
    }
  }
`

export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContactMutation($contactId: ID!, $firstName: String, $lastName: String) {
    updateContact(id: $contactId, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`

export const PHONE_NUMBERS_QUERY = gql`
  query PhoneNumbersQuery($contactId: ID!) {
    phoneNumbers(contactId: $contactId) {
      id
      phoneNumber
      label
      contactId
    }
  }
`


export const POST_MUTATION = gql`
  mutation PostMutation($firstName: String!, $lastName: String!) {
    post(firstName: $firstName, lastName: $lastName) {
      id,
      firstName,
      lastName
    }
  }
`



export const DELETE_CONTACT_MUTATION = gql`
  mutation DeleteMutation($contactId: ID!) {
    removeContact(id: $contactId) {
      id
      firstName
      lastName
    }
  }
`

export const ADD_PHONE_NUMBER_MUTATION = gql`
  mutation AddPhoneNumberMutation($phoneNumber: String!, $label: String!, $contactId: ID!) {
    addPhoneNumber(phoneNumber: $phoneNumber, label: $label, contactId: $contactId) {
      id,
      phoneNumber,
      label,
      contactId
    }
  }
`

export const DELETE_PHONE_NUMBER_MUTATION = gql`
  mutation DeletePhoneNumberMutation($id: ID!) {
    deletePhoneNumber(id: $id) {
      id
      phoneNumber
      label
      contactId
    }
  }
`

export const DELETE_PHONE_NUMBERS_MUTATION = gql`
  mutation DeleteMutation($contactId: ID!) {
    removePhoneNumbers(contactId: $contactId) {
      count
    }
  }
`

export const UPDATE_PHONE_NUMBER_MUTATION = gql`
  mutation UpdatePhoneNumberMutation($id: ID!, $firstName: String, $lastName: String, $contactId: ID!) {
    updatePhoneNumber(id: $id, firstName: $firstName, lastName: $lastName, contactId: $contactId) {
      id
      firstName
      lastName
      contactId
    }
  }
`
