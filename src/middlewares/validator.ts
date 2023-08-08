import { RequestHandler } from "express";
import * as yup from "yup";

/**
 * This middleware acts as a filter or gatekeeper for the routes. If the
 * request body doesn't match the expected structure and validation rules
 * defined in the yup schema, the client will receive an error message and
 * the request won't proceed to subsequent middleware or route handlers.
 * If the body is valid, the request continues through the Express middleware
 * pipeline
 * @name validate
 * @param {Object} schema - A yup validation schema against which the request body will be validated.
 * @returns {RequestHandler} - An Express middleware that validates the request body.
 */
export function validate(schema: any): RequestHandler {
  return async (req, res, next) => {
    // If the incoming request doesn't have a body (i.e., it's null or
    // undefined), the middleware will send an error response to the
    // client stating that an empty body was not expected.
    if (!req.body) return res.json({ error: "Empty body is not expected" });
    //  creates a yup schema object where the object's body property should
    //  conform to the schema provided as an argument to the middleware function
    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      // attempts to validate the request's body against the constructed schema
      await schemaToValidate.validate(
        {
          body: req.body,
        },
        {
          // Return from validation methods on the first
          // error rather than after all validations run
          abortEarly: true,
        }
      );
      // is called, moving the request to the next
      // middleware or route handler in the pipeline.
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.json({ error: error.message });
      }
    }
  };
}
