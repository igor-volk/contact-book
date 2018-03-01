const { APP_SECRET, getUserId } = require('../utils')

function post(parent, { firstName, lastName, phoneNumbers }, ctx, info) {
  return ctx.db.mutation.createContact({
    data: {
      firstName,
      lastName,
      phoneNumbers
    }}, info
  )
}

function removeContact(parent, { id }, ctx, info) {
    return ctx.db.mutation.deleteContact({
        where: {
            id
        }}, info
    )
}

function updateContact(parent, { id, firstName, lastName, phoneNumbers }, ctx, info) {
    return ctx.db.mutation.updateContact({
        where: {
            id
        },
        data: {
            firstName,
            lastName,
            phoneNumbers
        }}, info
    )
}

async function addPhoneNumber(parent, { contact, phoneNumber, label }, ctx, info) {
  const phoneExists = await ctx.db.exists.PhoneNumber({
      contact,
      phoneNumber
  });

  if (phoneExists) {
      throw new Error(`Phone number already aded: ${phoneNumber}`)
  }

  const phoneNumber = await ctx.db.mutation.createPhoneNumber({ data: { contact, phoneNumber, label } }, info);

  return phoneNumber;
}

async function deletePhoneNumber(parent, { id }, ctx, info) {
  const phoneNumber = await ctx.db.mutation.deletePhoneNumber({ data: { id }, info});

  return phoneNumber;
}

async function updatePhoneNumber(parent, { id, phoneNumber, label }, ctx, info) {
  const phoneNumber = await ctx.db.mutation.updatePhoneNumber({ data: { id, phoneNumber, label } }, info);

  return phoneNumber;
}

module.exports = {
  post,
  removeContact
}
