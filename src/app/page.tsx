import { Metadata } from 'next'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import FormButton from '@/components/FormButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export const metadata: Metadata = {
  title: 'Base Template',
  description: 'This is base template',
}

export default function RootPage() {
  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'bg.main' }} disableGutters>
      <Container maxWidth="lg" sx={{ height: '100vh' }}>
        Landing page
      </Container>
    </Container>
  )
}
