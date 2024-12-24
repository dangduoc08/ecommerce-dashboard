'use client'

import './card.scss'
import Button from '@/components/Button'

export interface CardProps {
  title: string
  desc?: string
  icon?: React.ReactElement
  children?: React.ReactNode
}

export default function Card({ children, title }: CardProps) {
  return (
    <div className="card-component">
      <div className="card-component__content">
        <div className="card-component__icon">this is icon</div>
        <h2 className="card-component__title">{title}</h2>
      </div>
      {children ?? <div className="card-component__desc">{children}</div>}
      <Button></Button>
    </div>
  )
}
