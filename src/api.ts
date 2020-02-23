const apiUrl = 'https://api.punkapi.com/v2'

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH'
}

const callApi = <R> (endpoint: string, requestMethod: RequestMethod, requestBody?: Object) =>
  fetch(
    `${apiUrl}/${endpoint}`, 
    { 
      method: requestMethod, 
      body: JSON.stringify(requestBody), 
      headers: {
        'Content-Type': 'application/json'
    } }
  )
    .then(res =>
      res.ok
        ? res.json() as Promise<R>
        : Promise.reject(res.status))

export default callApi
