import Link from 'next/link'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Drawer from '@mui/material/Drawer'

export interface IDashBoardLayout {
  children: React.ReactNode
}

const Navs = [
  {
    href: '/dashboard/orders',
    name: 'order',
  },
  {
    href: '/dashboard/product',
    name: 'product',
  },
  {
    href: '/dashboard/settings',
    name: 'settings',
  },
]

const renderList = (nav: any) => (
  <ListItem disablePadding key={nav.href}>
    <Link href={nav.href}>
      <ListItemButton>
        <ListItemIcon>
          <MenuIcon />
        </ListItemIcon>
        <ListItemText primary={nav.name} />
      </ListItemButton>
    </Link>
  </ListItem>
)

export default function DashBoardLayout({ children }: IDashBoardLayout) {
  return (
    <Container>
      <Drawer hideBackdrop open anchor="left">
        <List>{Navs.map(renderList)}</List>
      </Drawer>
      <Box sx={{ marginLeft: '240px', height: '100vh' }}>{children}</Box>
    </Container>
  )
}
