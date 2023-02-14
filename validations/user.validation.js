const joi = require("joi");
const AppError = require("../utils/AppError");
module.exports = (req, res, next) => {
    const schema = {
        body: joi.object({
            firstName: joi.string().required().min(3).max(20),
            lastName: joi.string().required().min(3).max(20),
            email: joi.string().required().email(),
            password: joi.string().required(),
            confirmPassword: joi.any().valid(joi.ref('password')).required()
        }).required()
    }
    const { error } = schema.body.validate(req.body);

    if (error) {
        throw new AppError(404, error.details[0].message);
    } else {
        next();
    }
};
