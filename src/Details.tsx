import React, { FC, useEffect, useState } from 'react'
import { Beer } from './types'
import callApi, { RequestMethod } from './api'
import Toast from './Toast'
import { CircularProgress, Typography, Card, CardContent, CardMedia, makeStyles, createStyles, AppBar, Toolbar, IconButton, Paper, } from '@material-ui/core'
import { useParams, Redirect } from 'react-router'
import { ArrowBack } from '@material-ui/icons'
import { composeParams } from './helpers'

const useStyles = makeStyles(() =>
  createStyles({
    beerDetails: {
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    container: {
      display: 'flex',
      height: 'calc(100% - 56px)',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    content: {
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateRows: '2fr 1fr'
    },
    image: {
      height: 200,
      width: 200,
      backgroundSize: 'contain',
    },
    tileImage: {
      height: 100,
      width: 100,
      backgroundSize: 'contain',
    },
    similarBeers: {
      display: 'flex',
      position: 'absolute',
    },
    similarBeersWrapper: {
      position: 'relative',
      overflow: 'scroll',
      height: '100%'
    },
    similarBeer: {
      height: 200,
      width: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }),
)

const Details: FC<{}> = () => {
  const { beerId } = useParams()
  const paramValid = beerId && beerId.match(/^[0-9]+$/)
  const classes = useStyles()
  const [beer, setBeer] = useState<Beer>()
  const [similarBeers, setSimilarBeers] = useState<Beer[]>()
  const [newSelectedBeer, setNewSelectedBeer] = useState<number>()
  const [requestPending, setRequestPending] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [back, setBack] = useState(false)

  const handleToastClose = () => setErrorMessage('')

  useEffect(() => {
    setRequestPending(true)
    beerId && paramValid && callApi<Beer[]>(`beers/${beerId}`, RequestMethod.GET)
      .then((beers) => {
        const beerDetails = beers[0]
        setBeer(beerDetails)
        const composedParams = composeParams(
          ['ibu_gt', `${beerDetails.ibu - 1}`],
          ['ibu_lt', `${beerDetails.ibu + 1}`]
        )
        return beerDetails && callApi<Beer[]>(`beers?${composedParams}`, RequestMethod.GET)
      })
      .then((newSimilarBeers) => setSimilarBeers(newSimilarBeers.filter((beer) => beer.id !== parseInt(beerId))))
      .catch((status) => status !== 404 && setErrorMessage('Something went wrong'))
      .finally(() => setRequestPending(false))
  }, [beerId])

  const handleArrowButtonClick = () => setBack(true)
  const handleSimilarBeerClick = (beerId: number) => () => setNewSelectedBeer(beerId)

  return (
    <>
      {(!paramValid || back) && <Redirect to="/" />}
      {newSelectedBeer && <Redirect to={`/beer/${newSelectedBeer}`} />}
      <AppBar position="relative">
        <Toolbar disableGutters>
          <IconButton onClick={handleArrowButtonClick}>
            <ArrowBack />
          </IconButton>
          <Typography
            align="center"
          >
            Details
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        {requestPending ? (
          <CircularProgress />
        ) : beer && similarBeers ? (
          <div className={classes.content}>
            <Card className={classes.beerDetails} key={beer.name}>
              <CardMedia
                className={classes.image}
                image={beer.image_url}
              />
              <CardContent>
                <Typography component="h5" variant="h5">
                  {beer.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {"Description: "}
                  {beer.description}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {"Berwer tips: "}
                  {beer.brewers_tips}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {"IBU: "}
                  {beer.ibu}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {"ABV: "}
                  {beer.abv}
                </Typography>
              </CardContent>
            </Card>
            <div>
              <Typography>Similar beers: </Typography>
              <div className={classes.similarBeersWrapper}>
                <Paper className={classes.similarBeers}>
                  {similarBeers.map((similarBeer) => (
                    <Card key={similarBeer.id} className={classes.similarBeer} onClick={handleSimilarBeerClick(similarBeer.id)}>
                      <CardMedia
                        className={classes.tileImage}
                        image={similarBeer.image_url}
                      />
                      {similarBeer.name}
                    </Card>
                  ))}
                </Paper>
              </div>
            </div>
          </div>
        ) : (
              <Typography>404 <span role="img" aria-label="beer">🍺</span></Typography>
            )
        }
        <Toast
          open={!!errorMessage}
          onClose={handleToastClose}
          type="error"
        >
          {errorMessage}
        </Toast>
      </div>
    </>
  )
}

export default Details
