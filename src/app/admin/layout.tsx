import Container from '@mui/material/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang Quản Trị',
  description: 'This is base template',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Container>{children}</Container>
}
