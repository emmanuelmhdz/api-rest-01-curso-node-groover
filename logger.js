
const logger = (req, res, next) => {
    console.log('Soy logger');
    next();
}

module.exports = {
    logger
}