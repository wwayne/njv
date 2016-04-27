/**
 * This middleware is used for validate if the request conform to the jsonapi's demanding
 * It will return specific status code according to the jsonapi official doc
 * @see http://jsonapi.org/format/#content-negotiation
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _buildHttpError = require('http-errors');

var _buildHttpError2 = _interopRequireDefault(_buildHttpError);

var jsonValidator = function jsonValidator() {
  return function (req, res, next) {
    /* Verify json api
     * Example:
     * @Content-Type: application/vnd.api+json
     * @Accept: application/vnd.api+json or Accept: application/vnd.api.v1+json
     */
    var resContentTypes = req.get('content-type');
    var resAccept = req.get('accept');
    var resAcceptRange = resAccept ? resAccept.split(',') : [];

    /* When body has data, need to validate content type */
    var contentLength = req.headers['content-length'];
    if (contentLength > 0 && resContentTypes !== 'application/vnd.api+json') {
      return next((0, _buildHttpError2['default'])(415));
    }

    /* Check client Accept, if it contains JSON APIs and
     * all of these JSON APIs contain Media params, return 406
     */
    var regExp = /^\s*application\/vnd\.api\+json$/i;
    var isAcceptable = true;
    var eachMediaArray = [];

    resAcceptRange.filter(function (accept) {
      eachMediaArray = accept.split(';');
      return regExp.test(eachMediaArray[0]);
    }).some(function (accept) {
      eachMediaArray = accept.split(';');
      if (eachMediaArray.length > 1) {
        isAcceptable = false;
        return false;
      }
      isAcceptable = true;
      return true;
    });
    if (!isAcceptable) {
      return next((0, _buildHttpError2['default'])(406));
    }

    next();
  };
};

exports['default'] = jsonValidator;
module.exports = exports['default'];

