const joi = require("joi");
const AppError = require("../utils/AppError");
module.exports = (req, res, next) => {
    const schema = {
        body: joi.object({
            title: joi.string().min(3).max(30).required(),
            description: joi.string().min(3).max(30).required(),
            image: joi.string().min(3).max(30),
            userId: joi.string().min(3).max(30).required(),
            deadline: joi.string().min(3).max(30).required(),

        }).required()
    }
    const { error } = schema.body.validate(req.body);

    if (error) {
        throw new AppError(404, error.details[0].message);
    } else {
        next();
    }
};
