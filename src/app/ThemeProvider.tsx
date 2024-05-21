'use client'

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
  PaletteColorOptions,
} from '@mui/material/styles'
import SnackbarProvider from '../contexts/Snackbar/SnackbarProvider'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    bg: PaletteColorOptions
  }
}

let theme = createTheme({
  palette: {
    primary: {
      main: '#264653',
    },
    secondary: {
      main: '#f4a261',
    },
    error: {
      main: '#e76f51',
    },
    warning: {
      main: '#e9c46a',
    },
    success: {
      main: '#2a9d8f',
    },
    info: {
      main: '#118ab2',
    },
    bg: {
      main: '#efefef',
      light: '#f2f2f2',
      dark: '#a7a7a7',
      contrastText: '#000000de',
    },
  },
  typography: {
    h1: {
      fontSize: '2.875rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2.375rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.8125rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.9375rem',
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.8125rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
  },
})

theme = responsiveFontSizes(theme)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </MuiThemeProvider>
  )
}
