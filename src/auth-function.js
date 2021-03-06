let promisedFunction;

const debug = require('debug')('lambda-custom-authorizer-middleware');

/**
 * Get promisified lambda function by path and exported handler name
 * @param {String} handlerPath Path on local file system to the function
 * @param {String} handlerName Name of the exported function in provided path
 * @return {(function(*=): Promise)|*} Promisified function
 */
export function getAuthFunction(handlerPath, handlerName) {
  if (promisedFunction) {
    debug(`[handler-loaded]`);
    return promisedFunction;
  }

  debug(`[handler-loading][path:${handlerPath}][name:${handlerName}]`);
  const cbFunction = require(handlerPath)[handlerName];

  promisedFunction = event => new Promise((resolve, reject) => {
    cbFunction(event, {}, (error, response) => {
      if (error) {
        return reject(error);
      }

      return resolve(response);
    });
  });
  debug(`[handler-loaded]`);

  return promisedFunction;
}
