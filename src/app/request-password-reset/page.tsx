'use client'

import { useEffect, useContext } from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import LockOutlinedIcon from '@mui/icons-material/Lock'
import DoneIcon from '@mui/icons-material/Done'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import FormButton from '@/components/FormButton'
import requestPasswordReset from '@/actions/auths/requestPasswordReset'
import { SnackbarContext } from '@/contexts/Snackbar/SnackbarProvider'
import { IApiResponse, IAuthRequestPasswordReset } from '@/actions/interface'

export default function RequestPasswordResetPage() {
  const formState: IApiResponse<IAuthRequestPasswordReset> & {
    shouldComponentRender: boolean
  } = {
    shouldComponentRender: false,
  }
  const [nextFormState, requestPasswordResetAction] = useFormState(requestPasswordReset, formState)
  const { dispatch } = useContext(SnackbarContext)

  useEffect(() => {
    if (nextFormState.messages && nextFormState.messages?.[0]?.reason) {
      dispatch({ type: 'error', message: nextFormState.messages[0].reason })
      return
    }
  }, [nextFormState.shouldComponentRender])

  const Form = () => {
    return (
      <>
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
                Quên Mật Khẩu
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography gutterBottom align="left" variant="caption">
                Nhập tên đăng nhập hoặc email của bạn, chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu
                vào mail của bạn.
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box action={requestPasswordResetAction} component="form" sx={{ width: '100%' }}>
          <Grid container rowSpacing={2}>
            <Grid
              sx={{
                marginTop: 2,
              }}
              xs={12}
            >
              <TextField name="user_identity" required fullWidth label="Tên Đăng Nhập Hoặc Email" />
            </Grid>
            <Grid
              sx={{
                marginTop: 1,
              }}
              xs={12}
            >
              <FormButton variant="contained" fullWidth>
                Gửi
              </FormButton>
            </Grid>
            <Grid
              sx={{
                marginTop: 2,
                textAlign: 'center',
              }}
              xs={12}
            >
              <Link href="/admin">
                <Typography>Quay trở lại</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </>
    )
  }

  const Success = () => {
    return (
      <Box
        sx={{
          paddingTop: 14,
        }}
      >
        <Grid container>
          <Grid
            sx={{
              padding: 1,
            }}
            xs={12}
          >
            <Typography gutterBottom align="left" variant="h5" component="h1">
              <DoneIcon
                sx={{ position: 'relative', top: '7px' }}
                color="success"
                fontSize="large"
              />{' '}
              Đã Hoàn Thành!
            </Typography>
            <Grid xs={12}>
              <Typography gutterBottom align="left" variant="body1">
                Nếu thông tin đã nhập liên kết với tài khoản của Shop 5 Châu, chúng tôi sẽ gửi cho
                bạn 1 email kèm hướng dẫn đặt lại mật khẩu.
              </Typography>
            </Grid>
            <Grid
              sx={{
                marginTop: 2,
                textAlign: 'left',
              }}
              xs={12}
            >
              <Link href="/admin">
                <Typography>Quay trở lại trang đăng nhập</Typography>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Container maxWidth={'xs'}>{nextFormState?.data?.requested ? <Success /> : <Form />}</Container>
  )
}
