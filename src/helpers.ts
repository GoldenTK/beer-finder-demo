
import { identity } from 'lodash/fp'

export const composeParams = (...params: Array<[string, string]>) =>
  params
    .flatMap((param) => param[1].length ? `${param[0]}=${param[1]}` : false)
    .filter(identity)
    .join('&')
