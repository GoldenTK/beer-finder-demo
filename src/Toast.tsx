import React, { FC } from 'react'
import { Snackbar, SnackbarContent, makeStyles, Theme } from '@material-ui/core'
import { Error, CheckCircle } from '@material-ui/icons'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    margin: theme.spacing(1),
  },
  success: {
    backgroundColor: green[600],
    margin: theme.spacing(1),
  },
  snackBarIcon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
  snackBarMessage: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  }
}))

const Toast: FC<ToastProps> = ({ open, onClose, children, type }) => {
  const classes = useStyles()

  return (
    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes[type]}
        message={(
          <span className={classes.snackBarMessage}>
            {type === 'error' && <Error className={classes.snackBarIcon} />}
            {type === 'success' && <CheckCircle className={classes.snackBarIcon} />}
            {children}
          </span>
        )}
      />
    </Snackbar>
  )
}

interface ToastProps {
  open: boolean,
  onClose: () => void,
  type: 'error' | 'success'
}

export default Toast
