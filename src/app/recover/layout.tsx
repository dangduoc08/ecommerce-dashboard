import Container from '@mui/material/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đổi Mật Khẩu',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'bg.main', height: '100vh' }}>
      {children}
    </Container>
  )
}
