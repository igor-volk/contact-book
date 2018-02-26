async function feed(parent, args, ctx, info) {
  const allContacts = await ctx.db.query.contacts({})
  const count = allContacts.length

  return {
    linkIds: allContacts.map(contact => contact.id),
    count
  }
}

module.exports = {
  feed,
}
