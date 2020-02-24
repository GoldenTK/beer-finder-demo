import { spy } from 'sinon'
import { identity } from 'lodash/fp'
import { shallow } from 'enzyme'
import React from 'react'
import Home from './Home'
import { initialState } from './App'
import { TextField } from '@material-ui/core'

it('renders correct structure', () => {
  const home = shallow(<Home state={initialState} onStateChange={identity} />)
  expect(home).toMatchSnapshot()
})

it('should call state update on beer name change', () => {
  const stateChangeSpy = spy()
  const home = shallow(<Home state={initialState} onStateChange={stateChangeSpy} />)

  home.find(TextField).at(0).simulate('change', {
    target: {
      value: 'value'
    }
  })

  stateChangeSpy.calledWith({ filter: { name: 'value' }, page: 0 })
})

it('should call state update on malt change', () => {
  const stateChangeSpy = spy()
  const home = shallow(<Home state={initialState} onStateChange={stateChangeSpy} />)

  home.find(TextField).at(0).simulate('change', {
    target: {
      value: 'value'
    }
  })

  stateChangeSpy.calledWith({ filter: { malt: 'value' }, page: 0 })
})
