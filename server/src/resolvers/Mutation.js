const { APP_SECRET, getUserId } = require('../utils')

async function addContact(parent, { firstName, lastName, phoneNumbers }, ctx, info) {
  return ctx.db.mutation.addContact({
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

  const phoneNumber = await ctx.db.mutation.addPhoneNumber({ data: { contact, phoneNumber, label } }, info);

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
  addContact,
  addPhoneNumber,
  deletePhoneNumber,
  updatePhoneNumber
}
