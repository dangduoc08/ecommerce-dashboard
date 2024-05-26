import Link from 'next/link'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'

export interface IDashBoardLayout {
  children: React.ReactNode
}

export default function DashBoardLayout({ children }: IDashBoardLayout) {
  const navs = [
    {
      href: '/dashboard',
      name: 'Tổng quan',
      icon: <MenuIcon />,
    },
    {
      href: '/dashboard/product',
      name: 'Sản phẩm',
    },
    {
      href: '/dashboard/settings',
      name: 'Cấu hình',
    },
  ]

  const renderList = (nav: any) => (
    <ListItem disablePadding key={nav.href}>
      <Link href={nav.href}>
        <ListItemButton>
          <ListItemIcon>{nav.icon}</ListItemIcon>
          <ListItemText primary={nav.name} />
        </ListItemButton>
      </Link>
    </ListItem>
  )

  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'bg.light', height: '100vh' }}>
      <Box sx={{ marginLeft: '240px', height: '100vh' }}>
        <AppBar color="primary" position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // onClick={handleDrawerOpen}
              edge="start"
              // sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Persistent drawer
            </Typography>
          </Toolbar>
        </AppBar>
        {children}
      </Box>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        hideBackdrop
        open
        anchor="left"
      >
        <div>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{navs.map(renderList)}</List>
      </Drawer>
    </Container>
  )
}
