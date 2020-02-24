import React, { useState } from 'react'
import { defaultsDeep } from 'lodash/fp'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import './App.css'
import { CssBaseline } from '@material-ui/core'
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import Home from './Home'
import Details from './Details'
import { RecursivePartial } from './types'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  }
})

theme.spacing(2)

const redirectToHome = () =>
  <Redirect to="/" />

export interface FilterParams {
  name: string,
  malt: string
}

export interface GlobalState {
  page: number,
  rowsPerPage: number,
  filter: FilterParams
}

export type PartialGlobalState = RecursivePartial<GlobalState>
export const initialState = {
  page: 0,
  rowsPerPage: 5,
  filter: {
    name: '',
    malt: ''
  }
}

const App: React.FC = () => {
  const [globalState, setGlobalState] = useState<GlobalState>(initialState)

  const handleStateChange = (newState: PartialGlobalState) =>
    setGlobalState(defaultsDeep(globalState, newState))

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Switch>
          <Route exact path="/">
            <Home
              state={globalState}
              onStateChange={handleStateChange}
            />
          </Route>
          <Route path="/beer/:beerId" component={Details} />
          <Route path="*" render={redirectToHome} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
