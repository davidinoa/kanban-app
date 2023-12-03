import {
  Button as NextUiButton,
  type ButtonProps as NextUiButtonProps,
} from '@nextui-org/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const buttonStyles = cva(
  [
    'transition-colors',
    'font-bold',
    'rounded-3xl',
    'data-[hover=true]:!opacity-100',
    'disabled:data-[hover=true]:!opacity-30',
    'disabled:opacity-30',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-auto',
    'min-w-fit',
    'w-fit',
    'h-auto',
    'px-4',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-purple-100',
          'disabled:bg-purple-100',
          'hover:bg-purple-50',
          'text-white',
        ],
        secondary: [
          'bg-purple-100/10',
          'disabled:bg-purple-100/10',
          'hover:bg-purple-100/25',
          'text-purple-100',
          'dark:bg-white',
          'dark:hover:bg-gray-50',
          'dark:text-purple-100',
        ],
        danger: [
          'bg-red-100',
          'disabled:bg-red-100',
          'hover:bg-red-50',
          'text-white',
        ],
        icon: [
          'bg-transparent',
          'disabled:bg-transparent',
          'hover:bg-gray-50',
          'dark:hover:bg-gray-200',
        ],
        ghost: [
          'bg-transparent',
          'disabled:bg-transparent',
          'hover:bg-gray-50',
          'dark:hover:bg-gray-200',
        ],
      },
      size: {
        small: ['text-sm', 'py-2.5'],
        large: ['text-base', 'py-3'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'small',
    },
  },
)

type ButtonProps = VariantProps<typeof buttonStyles> &
  Omit<NextUiButtonProps, 'variant' | 'size'>

function BaseButton(
  { variant, size, children, className, ...props }: ButtonProps,
  _ref: unknown,
) {
  return (
    <NextUiButton
      {...props}
      isIconOnly={variant === 'icon'}
      className={twMerge(buttonStyles({ variant, size }), className)}
    >
      {children}
    </NextUiButton>
  )
}

const Button = forwardRef(BaseButton)
export default Button
