'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from './ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <ThemeProvider>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
