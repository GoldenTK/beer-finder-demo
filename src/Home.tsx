import React, { FC, useState, useCallback } from 'react'
import { debounce } from 'lodash/fp'
import { makeStyles, createStyles, Typography, TextField } from '@material-ui/core'
import BeersList from './BeersList'
import { PartialGlobalState, GlobalState } from './App'

const useStyles = makeStyles(() =>
  createStyles({
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    },
    formControl: {
      minWidth: 120,
    },
  }),
)

const Home: FC<{
  state: GlobalState,
  onStateChange: (newOptions: PartialGlobalState) => void
}> = ({ state, onStateChange }) => {
  const classes = useStyles()
  const [filter, setFilter] = useState({ name: state.filter.name, malt: state.filter.malt })

  const memoizedFilterUpdate = useCallback(debounce(1000, (name: string, malt: string) =>
    setFilter({ name, malt })), [])

  const handleBeerNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onStateChange({ filter: { name: event.target.value }, page: 0 })
    memoizedFilterUpdate(event.target.value, state.filter.malt)
  }

  const handleMaltChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onStateChange({ filter: { malt: event.target.value }, page: 0 })
    memoizedFilterUpdate(state.filter.name, event.target.value)
  }

  return (
    <>
      <div className={classes.filterGroup}>
        <Typography variant="subtitle1">Filter: </Typography>
        <TextField label="Name" value={state.filter.name} onChange={handleBeerNameChange} />
        <TextField label="Malt" value={state.filter.malt} onChange={handleMaltChange} />
      </div>
      <BeersList
        filter={filter}
        page={state.page}
        rowsPerPage={state.rowsPerPage}
        onStateChange={onStateChange}
      />
    </>
  )
}

export default Home
