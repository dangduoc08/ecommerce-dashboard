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
import session from '@/actions/auths/session'
import { SnackbarContext } from '@/contexts/Snackbar/SnackbarProvider'
import { IApiResponse, IAuthSession } from '@/actions/interface'
import { useLocalStorage } from '@/hooks/userLocalStorage'

export default function AdminPage() {
  const formState: IApiResponse<IAuthSession> & { shouldComponentRender: boolean } = {
    shouldComponentRender: false,
  }
  const [nextFormState, sessionAction] = useFormState(session, formState)
  const { dispatch } = useContext(SnackbarContext)
  const [showPassword, setShowPassword] = useState(false)
  const [isPrefill, setIsPrefill] = useState(false)
  const router = useRouter()
  const [_, setRefreshTokenLocalStorage] = useLocalStorage('refresh_token')
  const [formData, setFormData] = useState({
    username: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
    },
  })

  const [adminPrefillLocalStorage, setAdminPrefillLocalStorage] = useLocalStorage('admin_prefill', {
    isPrefill,
    username: formData.username.value,
    password: formData.password.value,
  })

  useEffect(() => {
    formData.username.value = adminPrefillLocalStorage?.username ?? ''
    formData.password.value = adminPrefillLocalStorage?.password ?? ''
    setFormData({ ...formData })
    setIsPrefill(adminPrefillLocalStorage.isPrefill)
  }, [])

  useEffect(() => {
    if (nextFormState.messages && nextFormState.messages?.length > 0) {
      nextFormState.messages?.forEach((message) => {
        formData[message.field as keyof typeof formData].error = message.reason
      })
      setFormData({ ...formData })
    } else {
      resetErrorMessages()
    }

    if (!!nextFormState.code && !!nextFormState.message) {
      dispatch({ type: 'error', message: nextFormState.message })
      return
    }

    if (nextFormState.data?.refresh?.token) {
      setRefreshTokenLocalStorage<string>(
        `${nextFormState.data?.refresh?.type ?? ''} ${nextFormState.data.refresh.token}`.trim(),
        nextFormState.data?.refresh?.exp ?? 0 * 1000,
      )

      router.push('/dashboard')
    }
  }, [nextFormState.shouldComponentRender])

  const resetErrorMessages = () => {
    formData.username.error = ''
    formData.password.error = ''
    setFormData({ ...formData })
  }

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const { isPrefill } = adminPrefillLocalStorage

    formData[name as keyof typeof formData].error = ''
    formData[name as keyof typeof formData].value = value
    setFormData({ ...formData })

    if (isPrefill) {
      setAdminPrefillLocalStorage({
        ...adminPrefillLocalStorage,
        [name]: value || '',
      })
    }
  }

  const handlePrefill = (e: SyntheticEvent, checked: boolean) => {
    setAdminPrefillLocalStorage({
      username: checked ? formData.username.value : '',
      password: checked ? formData.password.value : '',
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
      <Box action={sessionAction} component="form" sx={{ width: '100%' }}>
        <Grid container rowSpacing={2}>
          <Grid
            sx={{
              marginTop: 2,
            }}
            xs={12}
          >
            <TextField
              error={!!formData.username.error}
              helperText={formData.username.error}
              onChange={handleOnInputChange}
              value={formData.username.value}
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
              error={!!formData.password.error}
              helperText={formData.password.error}
              onChange={handleOnInputChange}
              value={formData.password.value}
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
              disabled={!!formData.username.error || !!formData.password.error}
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
