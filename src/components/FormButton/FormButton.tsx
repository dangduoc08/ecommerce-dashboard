'use client'

import { useFormStatus } from 'react-dom'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

export interface FormButtonProps extends ButtonProps {
  loadingPosition?: 'start' | 'end'
}

export default function FormButton(props: FormButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      disabled={pending}
      startIcon={pending && <CircularProgress size={16} />}
      type="submit"
      {...props}
    >
      {<Typography color={`${props.color}.contrastText`}>{props.children}</Typography>}
    </Button>
  )
}
