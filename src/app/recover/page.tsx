'use client'

import { useState, useEffect, useContext, ChangeEvent } from 'react'
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
import { SnackbarContext } from '@/contexts/Snackbar/SnackbarProvider'
import { IApiResponse } from '@/actions/fetch'
import recover, { IAuthRecoverResponse } from '@/actions/auths/recover'

export default function RecoverPage() {
  const recoverFormState: IApiResponse<IAuthRecoverResponse> = {
    data: null,
    error: null,
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [recoverFormData, setRecoverFormData] = useState({
    password: {
      value: '',
      error: '',
    },
    confirm_password: {
      value: '',
      error: '',
    },
  })

  const [nextRecoverFormState, recoverAction] = useFormState(
    (prevState: IApiResponse<IAuthRecoverResponse>, formdata: FormData) => {
      const recoverReq = {
        body: {
          password: formdata.get('password')?.toString() ?? '',
          confirm_password: formdata.get('confirm_password')?.toString() ?? '',
        },
      }

      return recover(prevState, recoverReq)
    },
    recoverFormState,
  )

  const { dispatch } = useContext(SnackbarContext)

  const resetErrorMessages = () => {
    recoverFormData.password.error = ''
    recoverFormData.confirm_password.error = ''
    setRecoverFormData({ ...recoverFormData })
  }

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    resetErrorMessages()

    recoverFormData[name as keyof typeof recoverFormData].value = value
    setRecoverFormData({ ...recoverFormData })
  }

  useEffect(() => {
    const { message, error } = nextRecoverFormState

    if (Array.isArray(message) && message?.length > 0) {
      message?.forEach((msg) => {
        recoverFormData[msg.field as keyof typeof recoverFormData].error = msg.reason
      })
      setRecoverFormData({ ...recoverFormData })
    } else {
      resetErrorMessages()
    }

    if (!!error && !!message && typeof message == 'string') {
      dispatch({ type: 'error', message })
      return
    }
  }, [nextRecoverFormState.data, nextRecoverFormState.error])

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
              error={!!recoverFormData.password.error}
              helperText={recoverFormData.password.error}
              onChange={handleOnInputChange}
              value={recoverFormData.password.value}
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
              error={!!recoverFormData.confirm_password.error}
              helperText={recoverFormData.confirm_password.error}
              onChange={handleOnInputChange}
              value={recoverFormData.confirm_password.value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((show) => !show)}>
                      {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="confirm_password"
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
              disabled={
                !!recoverFormData.password.error || !!recoverFormData.confirm_password.error
              }
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
