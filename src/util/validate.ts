import * as Ajv from "ajv";

export function validate(
  ajv: Ajv.Ajv,
  schemaKeyRef: object | string | boolean,
  data: object
) {
  try {
    const valid: boolean | PromiseLike<boolean> = ajv.validate(
      schemaKeyRef,
      data
    );
    if (!valid) {
      console.error("Invalid data provided by adapter", ajv.errorsText());
    }
    // console.log("Adapter data is", {valid});
    return valid;
  } catch (e) {
    console.error("Error validating data", e, ajv.errorsText());
    // Ignore validation if validation is broken
    return true;
  }
}
