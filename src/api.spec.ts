import sinon from 'sinon'
import callApi, { RequestMethod, API_URL } from './api'

const fakeData = ['fake_beer']

const mockApiResponse = (body = {}, status: number) =>
  Promise.resolve(new window.Response(JSON.stringify(body), {
    status,
    headers: { 'Content-type': 'application/json' }
  }))

it('should resolve promise with data', async () => {
  const stubedFetchSuccess = sinon.stub(window, 'fetch').returns(mockApiResponse(fakeData, 200))
  const response = await callApi('endpoint', RequestMethod.GET, {})
  expect(response).toEqual(fakeData)
  expect(stubedFetchSuccess.calledOnce)
  stubedFetchSuccess.restore()
})

it('should reject promise and return response status', async () => {
  const stubedFetchFailure = sinon.stub(window, 'fetch').returns(mockApiResponse(fakeData, 500))
  try {
    await callApi('endpoint', RequestMethod.GET, {})
  } catch (responseStatus) {
    expect(responseStatus).toEqual(500)
    expect(stubedFetchFailure.calledOnce)
  }
  stubedFetchFailure.restore()
})

it('should call fetch with correct params', async () => {
  const stubedFetch = sinon.stub(window, 'fetch').returns(mockApiResponse(fakeData, 200))
  const fakeEndpoint = 'endpoint'
  await callApi(fakeEndpoint, RequestMethod.GET, {})
  expect(stubedFetch.calledWith(
    `${API_URL}/${fakeEndpoint}`,
    {
      method: RequestMethod.GET,
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ))
})
