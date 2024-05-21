import { createContext, useReducer, Dispatch } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'

interface ISnackbarContext {
  isOpen?: boolean
  message: string
  type: AlertColor
}

interface ISnackbarDispatch {
  state: ISnackbarContext
  dispatch: Dispatch<ISnackbarContext>
}

const initialState: ISnackbarContext = {
  isOpen: false,
  message: '',
  type: 'success',
}

const reducer = (
  state: ISnackbarContext,
  { type, isOpen, message }: ISnackbarContext,
): ISnackbarContext => {
  if (typeof isOpen !== 'boolean') {
    isOpen = true
  }

  switch (type) {
    case 'success':
    case 'info':
    case 'warning':
    case 'error':
      return { ...state, isOpen, type, message }
    default:
      return { ...state, isOpen: false }
  }
}

export const SnackbarContext = createContext<ISnackbarDispatch>({} as ISnackbarDispatch)

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch({} as ISnackbarContext)
  }

  return (
    <SnackbarContext.Provider value={{ state, dispatch }}>
      <Snackbar open={state.isOpen} onClose={handleClose} autoHideDuration={3000}>
        <Alert onClose={handleClose} severity={state.type} variant="filled" sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}
