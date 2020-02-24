import { composeParams } from './helpers'

describe('helpers', () => {
  it('should return correctly formated request params', () => {
    const composedParams = composeParams(
      ['param1', 'fakeValue1'],
      ['param2', 'fakeValue2'],
      ['param3', 'fakeValue3'],
      ['param4', '']
    )

    expect(composedParams).toEqual('param1=fakeValue1&param2=fakeValue2&param3=fakeValue3')
  })
})
