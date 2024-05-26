'use client'

import { useState, useEffect, useContext, ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormState } from 'react-dom'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/Lock'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import FormButton from '@/components/FormButton'
import recover from '@/actions/auths/recover'
import { SnackbarContext } from '@/contexts/Snackbar/SnackbarProvider'
import { IApiResponse, IAuthRecoverResponse } from '@/actions/interface'

export default function AdminPage() {
  const searchParams = useSearchParams()
  const formState: IApiResponse<IAuthRecoverResponse> & {
    shouldComponentRender: boolean
    token?: string
  } = {
    shouldComponentRender: false,
    token: `${searchParams.get('type')} ${searchParams.get('token')}`,
  }
  const [nextFormState, recoverAction] = useFormState(recover, formState)
  const { dispatch } = useContext(SnackbarContext)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: {
      value: '',
      error: '',
    },
    confirmPassword: {
      value: '',
      error: '',
    },
  })

  const resetErrorMessages = () => {
    formData.password.error = ''
    formData.confirmPassword.error = ''
    setFormData({ ...formData })
  }

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    resetErrorMessages()

    formData[name as keyof typeof formData].value = value
    setFormData({ ...formData })
  }

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

  }, [nextFormState.shouldComponentRender])

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
              Đổi Mật Khẩu
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box action={recoverAction} component="form" sx={{ width: '100%' }}>
        <Grid container rowSpacing={2}>
          <Grid
            sx={{
              marginTop: 2,
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
          <Grid
            sx={{
              marginTop: 1,
            }}
            xs={12}
          >
            <TextField
              error={!!formData.confirmPassword.error}
              helperText={formData.confirmPassword.error}
              onChange={handleOnInputChange}
              value={formData.confirmPassword.value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((show) => !show)}>
                      {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="confirmPassword"
              required
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Xác Nhận Mật Khẩu"
            />
          </Grid>
          <Grid
            sx={{
              marginTop: 1,
            }}
            xs={12}
          >
            <FormButton
              disabled={!!formData.password.error || !!formData.confirmPassword.error}
              variant="contained"
              fullWidth
            >
              Xác Nhận
            </FormButton>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
