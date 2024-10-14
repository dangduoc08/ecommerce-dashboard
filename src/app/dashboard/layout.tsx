'use client'

import { useState, useEffect, useContext, ChangeEvent, SyntheticEvent } from 'react'
import Link from 'next/link'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import SellIcon from '@mui/icons-material/Sell'
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
import { v1, FetchError } from '@/actions/fetch'
import me from '@/actions/auths/me'

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
  const navs = [
    {
      href: '/dashboard',
      name: 'Tổng quan',
      icon: <DashboardIcon />,
    },
    {
      href: '/dashboard/product',
      name: 'Sản phẩm',
      icon: <SellIcon />,
    },
    {
      href: '/dashboard/settings',
      name: 'Cấu hình',
      icon: <SettingsIcon />,
    },
  ]

  // const checkAuth = async () => {
  //   await v1.get('/admins/auths/me', { method: 'GET', credentials: 'include',   'mode': 'cors', })
  // }

  // useEffect(() => {
  //   me(false)
  // }, [])

  // let flag = true
  // if (flag) {
  //   const { shouldComponentRender } = await me(flag)
  //   flag = shouldComponentRender || false
  // }

  // let data = await fetch('https://api.vercel.app/blog')
  // let posts = await data.json()

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
        <AppBar sx={{ width: `calc(100% - ${240}px)` }} color="primary" position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Tổng Quan
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
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>{navs.map(renderList)}</List>
      </Drawer>
    </Container>
  )
}
