const { APP_SECRET, getUserId } = require('../utils')

function post(parent, { firstName, lastName }, ctx, info) {
  return ctx.db.mutation.createContact({
    data: {
      firstName,
      lastName
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

async function addPhoneNumber(parent, { phoneNumber, label, contactId,  }, ctx, info) {
    const phoneExists = await ctx.db.exists.PhoneNumber({
        phoneNumber
    });

    if (phoneExists) {
        throw new Error(`Phone number already added: ${phoneNumber}`)
    }

    return await ctx.db.mutation.createPhoneNumber({ data: { phoneNumber, label, contactId } }, info);
}

function removePhoneNumbers (parent, { contactId  }, ctx, info) {
    return ctx.db.mutation.deleteManyPhoneNumbers({
        where: {
            contactId
        }, info
    })
}

function updateContact(parent, { id, firstName, lastName }, ctx, info) {
    return ctx.db.mutation.updateContact({
        where: {
            id
        },
        data: {
            firstName,
            lastName
        }}, info
    )
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
    removeContact,
    addPhoneNumber,
    removePhoneNumbers
}
