'use client'

import { useState, useEffect, useContext, ChangeEvent } from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/Lock'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import FormButton from '@/components/FormButton'
import session from '@/actions/auths/session'
import { SnackbarContext } from '@/contexts/Snackbar/SnackbarProvider'
import { IApiResponse, IAuthSession } from '@/actions/interface'

export default function AdminPage() {
  const sessionState: IApiResponse<IAuthSession> = {}
  const [nextSessionState, sessionAction] = useFormState(session, sessionState)
  const { dispatch } = useContext(SnackbarContext)
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const resetErrorMessages = () => {
    setErrorMessages({ username: '', password: '' })
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    errorMessages[name as keyof typeof errorMessages] = ''
    setErrorMessages({ ...errorMessages })
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  useEffect(() => {
    if (nextSessionState.messages && nextSessionState.messages?.length > 0) {
      nextSessionState.messages?.forEach((message) => {
        errorMessages[message.field as keyof typeof errorMessages] = message.reason
      })
      setErrorMessages({ ...errorMessages })
    } else {
      resetErrorMessages()
    }

    if (!!nextSessionState.code && !!nextSessionState.message) {
      dispatch({ type: 'error', message: nextSessionState.message })
    }

    if (nextSessionState.data?.user) {
      const { first_name, last_name } = nextSessionState.data.user
      dispatch({ type: 'success', message: `Chào mừng ${first_name} ${last_name}` })
    }
  }, [nextSessionState])

  return (
    <Container maxWidth={'xs'}>
      <Box
        sx={{
          marginTop: 8,
        }}
      >
        <Grid container>
          <Grid
            sx={{
              padding: 1,
            }}
            xs={12}
          >
            <Avatar sx={{ margin: 'auto', bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          <Grid xs={12}>
            <Typography gutterBottom align="center" variant="h5" component="h1">
              Đăng Nhập
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box action={sessionAction} component="form" sx={{ width: '100%' }}>
        <Grid container rowSpacing={2}>
          <Grid
            sx={{
              marginTop: 1,
            }}
            xs={12}
          >
            <TextField
              error={!!errorMessages.username}
              helperText={errorMessages.username}
              onChange={handleOnChange}
              name="username"
              required
              fullWidth
              label="Tên Đăng Nhập"
            />
          </Grid>
          <Grid
            sx={{
              marginTop: 1,
            }}
            xs={12}
          >
            <TextField
              error={!!errorMessages.password}
              helperText={errorMessages.password}
              onChange={handleOnChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="password"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Mật Khẩu"
            />
          </Grid>
          <Grid xs={12}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Ghi nhớ thông tin"
            />
          </Grid>
          <Grid
            sx={{
              marginTop: 1,
            }}
            xs={12}
          >
            <FormButton
              disabled={!!errorMessages.username || !!errorMessages.password}
              variant="contained"
              color="info"
              fullWidth
            >
              Đăng Nhập
            </FormButton>
          </Grid>
        </Grid>
        <Grid
          sx={{
            marginTop: 2,
          }}
          xs={12}
        >
          <Link href="/password_reset">
            <Typography>Quên mật khẩu?</Typography>
          </Link>
        </Grid>
      </Box>
    </Container>
  )
}
