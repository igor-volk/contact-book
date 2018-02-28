function feed(parent, args, ctx, info) {
    const { filter, first, skip } = args // destructure input arguments
    const where = filter
        ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
        : {}

    return ctx.db.query.contacts({ first, skip, where }, info)
}

function contact(parent, { id }, ctx, info) {
    return ctx.db.query.contact({
        where: {
            id
        }}, info
    )
}

module.exports = {
    feed,
    contact
}
