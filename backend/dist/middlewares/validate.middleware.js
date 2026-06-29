"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const constants_1 = require("../constants");
/**
 * Generic Zod validation middleware.
 * Pass a schema that validates { body?, query?, params? }.
 */
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const fieldErrors = Object.entries(errors).map(([field, messages]) => ({
                field,
                message: messages[0] ?? 'Invalid value',
            }));
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Validation failed',
                errors: fieldErrors,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        // Attach parsed values back (safe, coerced values)
        if (result.data.body !== undefined)
            req.body = result.data.body;
        if (result.data.query !== undefined)
            req.query = result.data.query;
        if (result.data.params !== undefined)
            req.params = result.data.params;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map