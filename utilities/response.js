const sendError = (res, error, code) => {
    res.send({
        code: code,
        message: error
    })
}

module.exports = {
    sendError
}