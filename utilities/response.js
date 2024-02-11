const sendError = (res, error, code) => {
    res.status(code).json({
        code: code,
        message: error
    })
}

module.exports = {
    sendError
}
