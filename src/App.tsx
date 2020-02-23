import React, { useState } from 'react'
import { defaultsDeep } from 'lodash/fp'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import './App.css'
import { CssBaseline } from '@material-ui/core'
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import Home from './Home'
import Details from './Details'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  }
})

theme.spacing(2)

const redirectToHome = () =>
  <Redirect to="/" />

export interface TableOptions {
  page: number,
  rowsPerPage: number,
  filter: {
    name: string,
    malt: string
  }
}

const App: React.FC = () => {
  const [options, setOptions] = useState<TableOptions>({
    page: 0,
    rowsPerPage: 5,
    filter: {
      name: '',
      malt: ''
    }
  })

  const handleOptionsChange = (newOptions: TableOptions) =>
    setOptions(defaultsDeep(options, newOptions))

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Switch>
          <Route exact path="/">
            <Home
              options={options}
              onOptionsChange={handleOptionsChange}
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
