import React, { FC, useState, useCallback } from 'react'
import { debounce } from 'lodash/fp'
import { makeStyles, createStyles, Typography, TextField } from '@material-ui/core'
import BeersList from './BeersList'
import { TableOptions } from './App'

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
  options: TableOptions,
  onOptionsChange: (newOptions: any) => void
}> = ({ options, onOptionsChange }) => {
  const classes = useStyles()
  const [filter, setFilter] = useState({ name: options.filter.name, malt: options.filter.malt })

  const memoizedFilterUpdate = useCallback(debounce(1000, (name: string, malt: string) =>
    setFilter({ name, malt })), [])

  const handleBeerNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onOptionsChange({ filter: { name: event.target.value }, page: 0 })
    memoizedFilterUpdate(event.target.value, options.filter.malt)
  }

  const handleMaltChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onOptionsChange({ filter: { malt: event.target.value }, page: 0 })
    memoizedFilterUpdate(options.filter.name, event.target.value)
  }

  return (
    <>
      <div className={classes.filterGroup}>
        <Typography variant="subtitle1">Filter: </Typography>
        <TextField label="Name" value={options.filter.name} onChange={handleBeerNameChange} />
        <TextField label="Malt" value={options.filter.malt} onChange={handleMaltChange} />
      </div>
      <BeersList
        filter={filter}
        page={options.page}
        rowsPerPage={options.rowsPerPage}
        onOptionsChange={onOptionsChange}
      />
    </>
  )
}

export default Home
