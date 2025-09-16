"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
class Validator {
    constructor() { }
}
exports.Validator = Validator;
Validator.check = (schema) => {
    return (req, res, next) => {
        const { value, error } = schema.validate(req.body, {
            abortEarly: false,
        });
        if (error)
            throw error;
        next();
    };
};
