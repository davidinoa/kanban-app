import { Button as NextUiButton } from '@nextui-org/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonStyles = cva(
  [
    'transition-colors',
    'font-bold',
    'rounded-3xl',
    'disabled:bg-opacity-30',
    'disabled:cursor-not-allowed',
    'min-w-fit',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-purple-100', 'hover:purple-50', 'text-white'],
        secondary: [
          'bg-purple-100',
          'bg-opacity-10',
          'hover:bg-opacity-25',
          'text-purple-100',
          'dark:bg-white',
          'dark:hover:bg-gray-50',
          'dark:text-purple-100',
        ],
        danger: ['bg-red-100', 'hover:bg-red-50', 'text-white'],
        icon: ['bg-transparent', 'hover:bg-gray-50'],
        ghost: ['bg-transparent', 'hover:bg-gray-50', 'text-purple-100'],
      },
      size: {
        small: ['text-sm'],
        large: ['text-base', 'py-3', 'h-auto'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'small',
    },
  },
)

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<'button'>

export default function Button({
  variant,
  size,
  children,
  disabled,
  className,
}: ButtonProps) {
  return (
    <NextUiButton
      disabled={disabled}
      isIconOnly={variant === 'icon'}
      className={twMerge(buttonStyles({ variant, size }), className)}
    >
      {children}
    </NextUiButton>
  )
}
