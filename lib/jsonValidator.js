/**
 * This middleware is used for validate if the request conform to the jsonapi's demanding
 * It will return specific status code according to the jsonapi official doc
 * @see http://jsonapi.org/format/#content-negotiation
 */

import httpError from 'http-errors'

const jsonValidator = () => (req, res, next) => {
  /* Verify json api
   * Example:
   * @Content-Type: application/vnd.api+json
   * @Accept: application/vnd.api+json or Accept: application/vnd.api.v1+json
   */
  const resContentTypes = req.get('content-type')
  const resAccept = req.get('accept')
  const resAcceptRange = resAccept ? resAccept.split(',') : []

  /* When body has data, need to validate content type */
  const contentLength = req.headers['content-length']
  if (contentLength > 0 && resContentTypes !== 'application/vnd.api+json') {
    return next(httpError(415))
  }

  /* Check client Accept, if it contains JSON APIs and
   * all of these JSON APIs contain Media params, return 406
   */
  const regExp = /^\s*application\/vnd\.api\+json$/i
  let isAcceptable = true
  let eachMediaArray = []

  resAcceptRange.filter((accept) => {
    eachMediaArray = accept.split(';')
    return regExp.test(eachMediaArray[0])
  }).some((accept) => {
    eachMediaArray = accept.split(';')
    if (eachMediaArray.length > 1) {
      isAcceptable = false
      return false
    }
    isAcceptable = true
    return true
  })
  if (!isAcceptable) {
    return next(httpError(406))
  }

  next()
}

export default jsonValidator
