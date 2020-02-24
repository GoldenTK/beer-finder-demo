import { stub } from 'sinon'
import { shallow, mount } from 'enzyme'
import React from 'react'
import Details from './Details'
import reactRouter from 'react-router'
import { Card, CardContent, Typography } from '@material-ui/core'
import * as callApi from './api'
import { act } from 'react-dom/test-utils'

describe('Details', () => {
  const beer = {
    id: 0,
    name: 'fakeBeer',
    description: 'fakeDescription',
    image_url: 'fakeUrl',
    brewers_tips: '',
    ibu: 12,
    abv: 12,
  }
  const similarBeer = {
    id: 1,
    name: 'fakeBeer',
    description: 'fakeDescription',
    image_url: 'fakeUrl',
    brewers_tips: '',
    ibu: 12,
    abv: 12,
  }
  
  it('renders correct structure', () => {
    const fakeUseParams = stub(reactRouter, 'useParams').returns({ beerId: '1' })
    const details = shallow(<Details />)
    expect(details).toMatchSnapshot()
    fakeUseParams.restore()
  })
  
  it('should render beer details', async () => {
    const fakeUseParams = stub(reactRouter, 'useParams').returns({ beerId: '1' })
    const apiStub = stub(callApi, 'default')
      .onFirstCall().returns(Promise.resolve([beer]))
      .onSecondCall().returns(Promise.resolve([similarBeer]))
    const details = mount(<Details />)
    await act(async () => {
      await Promise.resolve(details);
      await new Promise(resolve => setImmediate(resolve));
      details.update();
    });
    const typographyList = details.find(Card).find(CardContent).find(Typography)
  
    expect(typographyList.length).toEqual(5)
    expect(typographyList.at(0).children().text()).toEqual(beer.name)
    expect(typographyList.at(1).children().text()).toEqual(`Description: ${beer.description}`)
    expect(typographyList.at(2).children().text()).toEqual(`Berwer tips: ${beer.brewers_tips}`)
    expect(typographyList.at(3).children().text()).toEqual(`IBU: ${beer.ibu}`)
    expect(typographyList.at(4).children().text()).toEqual(`ABV: ${beer.abv}`)
  
    fakeUseParams.restore()
    apiStub.restore()
  })
})
