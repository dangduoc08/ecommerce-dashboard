'use client'

import { useState, useEffect, useContext, ChangeEvent, SyntheticEvent } from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import signin, { IAuthSigninResponse } from '@/actions/auths/signin'
import { SnackbarContext } from '@/contexts/Snackbar/SnackbarProvider'
import { IApiResponse } from '@/actions/fetch'
import { useLocalStorage } from '@/hooks/userLocalStorage'
import { LocalStorageName, Path } from '@/constants'

export default function AdminPage() {
  const signinFormState: IApiResponse<IAuthSigninResponse> = {
    data: null,
    error: null,
  }
  
  const [showPassword, setShowPassword] = useState(false)
  const [isPrefill, setIsPrefill] = useState(false)
  const [signinFormData, setSinginFormData] = useState({
    username: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
    },
  })

  const [nextSigninFormState, signinAction] = useFormState(
    (prevState: IApiResponse<IAuthSigninResponse>, formdata: FormData) => {
      const signinReq = {
        body: {
          username: formdata.get('username')?.toString() ?? '',
          password: formdata.get('password')?.toString() ?? '',
        },
      }
      return signin(prevState, signinReq)
    },
    signinFormState,
  )

  const { dispatch } = useContext(SnackbarContext)

  const router = useRouter()

  const [adminPrefillLocalStorage, setAdminPrefillLocalStorage] = useLocalStorage(
    LocalStorageName.AdminPrefill,
    {
      isPrefill,
      username: signinFormData.username.value,
      password: signinFormData.password.value,
    },
  )

  useEffect(() => {
    const { username = '', password = '', isPrefill } = adminPrefillLocalStorage

    signinFormData.username.value = username
    signinFormData.password.value = password
    setSinginFormData({ ...signinFormData })
    setIsPrefill(isPrefill)
  }, [])

  useEffect(() => {
    const { message, error, data } = nextSigninFormState

    if (Array.isArray(message) && message?.length > 0) {
      message?.forEach((msg) => {
        signinFormData[msg.field as keyof typeof signinFormData].error = msg.reason
      })
      setSinginFormData({ ...signinFormData })
    } else {
      resetErrorMessages()
    }

    if (!!error && !!message && typeof message == 'string') {
      dispatch({ type: 'error', message })
      return
    }

    if (data?.refresh?.token && data?.refresh?.name && data?.refresh?.type && data?.refresh?.exp) {
      router.push(Path.DashBoard)
    }
  }, [nextSigninFormState.data, nextSigninFormState.error])

  const resetErrorMessages = () => {
    signinFormData.username.error = ''
    signinFormData.password.error = ''
    setSinginFormData({ ...signinFormData })
  }

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const { isPrefill } = adminPrefillLocalStorage

    signinFormData[name as keyof typeof signinFormData].error = ''
    signinFormData[name as keyof typeof signinFormData].value = value
    setSinginFormData({ ...signinFormData })

    if (isPrefill) {
      setAdminPrefillLocalStorage({
        ...adminPrefillLocalStorage,
        [name]: value || '',
      })
    }
  }

  const handlePrefill = (e: SyntheticEvent, checked: boolean) => {
    setAdminPrefillLocalStorage({
      username: checked ? signinFormData.username.value : '',
      password: checked ? signinFormData.password.value : '',
      isPrefill: checked,
    })
    setIsPrefill(checked)

    return
  }

  return (
    <Container maxWidth={'xs'}>
      <Box
        sx={{
          paddingTop: 8,
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
              <LockOutlinedIcon sx={{ color: 'secondary.contrastText' }} />
            </Avatar>
          </Grid>
          <Grid xs={12}>
            <Typography gutterBottom align="center" variant="h5" component="h1">
              Đăng Nhập
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box action={signinAction} component="form" sx={{ width: '100%' }}>
        <Grid container rowSpacing={2}>
          <Grid
            sx={{
              marginTop: 2,
            }}
            xs={12}
          >
            <TextField
              error={!!signinFormData.username.error}
              helperText={signinFormData.username.error}
              onChange={handleOnInputChange}
              value={signinFormData.username.value}
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
              error={!!signinFormData.password.error}
              helperText={signinFormData.password.error}
              onChange={handleOnInputChange}
              value={signinFormData.password.value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((show) => !show)}>
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="password"
              required
              fullWidth
              autoComplete="on"
              type={showPassword ? 'text' : 'password'}
              label="Mật Khẩu"
            />
          </Grid>
          <Grid xs={12}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Ghi nhớ thông tin"
              checked={isPrefill}
              onChange={handlePrefill}
            />
          </Grid>
          <Grid
            sx={{
              marginTop: 1,
            }}
            xs={12}
          >
            <FormButton
              disabled={!!signinFormData.username.error || !!signinFormData.password.error}
              variant="contained"
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
          <Link href="/request-password-reset">
            <Typography>Quên mật khẩu?</Typography>
          </Link>
        </Grid>
      </Box>
    </Container>
  )
}
