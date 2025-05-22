import * as React from "react"

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border border-gray-700 bg-gray-800 shadow ${className}`}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`p-4 ${className}`}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

export { Card, CardContent }
