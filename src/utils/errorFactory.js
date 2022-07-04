const createErrorPage = (req,res,error, errorNumber) => {
    req.session.error = error;
    req.session.errorNumber = errorNumber
    res.redirect("/api/v1/error")
}
module.exports = createErrorPage;