import './root.scss'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      {/* <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      ></link> */}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body>{children}</body>
    </html>
  )
}
