import React, { FC, useEffect, useState } from 'react'
import { Beer } from './types'
import callApi, { RequestMethod } from './api'
import Toast from './Toast'
import { CircularProgress, Typography, TableRow, Card, CardContent, CardMedia, makeStyles, createStyles, TableContainer, Paper, Table, TableBody, TableFooter, TablePagination, } from '@material-ui/core';
import { Redirect } from 'react-router'
import { composeParams } from './helpers'
import { PartialGlobalState } from './App';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    cardMedia: {
      minWidth: 100,
      margin: 3,
      borderRadius: 5,
      backgroundColor: 'grey',
      backgroundSize: 'contain'
    },
    container: {
      padding: 20
    }
  }),
);

const BeersList: FC<{
  page: number,
  rowsPerPage: number,
  filter: { name: string, malt: string },
  onStateChange: (newOptions: PartialGlobalState) => void
}> = ({ page = 0, rowsPerPage = 5, filter, onStateChange }) => {
  const classes = useStyles()
  const [beers, setBeers] = useState<Beer[]>([])
  const [requestPending, setRequestPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedBeer, setSelectedBeer] = useState<number>()

  useEffect(() => {
    const composedParams = composeParams(
      ['page', (page + 1).toString()],
      ['per_page', rowsPerPage.toString()],
      ['beer_name', filter.name],
      ['malt', filter.malt]
    )
    setRequestPending(true)
    callApi<Beer[]>(`beers?${composedParams}`, RequestMethod.GET)
      .then((beers) => setBeers(beers))
      .catch(() => setErrorMessage('Something went wrong'))
      .finally(() => setRequestPending(false))
  }, [page, rowsPerPage, filter])

  const handleToastClose = () => setErrorMessage('')

  const handleTileClick = (id: number) => () => setSelectedBeer(id)

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) =>
    onStateChange({ page: newPage })

  const handleRowsPerPageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => onStateChange({
    rowsPerPage: parseInt(event.target.value, 10),
    page: 0
  })

  return (
    <>
      {selectedBeer && <Redirect to={`beer/${selectedBeer}`} />}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <>
              <TableRow>
                {requestPending ? (
                  <th className={classes.container}>
                    <CircularProgress />
                  </th>
                ) : beers.length ? (
                  beers.map(beer => (
                    <Card key={beer.name} component="td" className={classes.card} onClick={handleTileClick(beer.id)}>
                      <CardContent>
                        <Typography component="h5" variant="h5">
                          {beer.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {beer.ingredients.malt.map((maltItem) => (
                            <Typography key={maltItem.name}>{maltItem.name}</Typography>
                          ))}
                        </Typography>
                      </CardContent>
                      <CardMedia
                        className={classes.cardMedia}
                        image={beer.image_url}
                        title="Live from space album cover"
                      />
                    </Card>
                  ))
                ) : (
                      <th className={classes.container}>
                        <Typography>No beers matching criteria :-(</Typography>
                      </th>
                )}
              </TableRow>
              <Toast
                open={!!errorMessage}
                onClose={handleToastClose}
                type="error"
              >
                {errorMessage}
              </Toast>
            </>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={filter.malt || filter.name ? beers.length : 100}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

export default BeersList
