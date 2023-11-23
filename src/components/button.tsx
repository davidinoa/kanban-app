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
    'w-fit',
    'h-auto',
    'px-4',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-purple-100', 'hover:bg-purple-50', 'text-white'],
        secondary: [
          'bg-purple-100/10',
          'hover:bg-purple-100/25',
          'data-[hover=true]:opacity-100',
          'text-purple-100',
          'dark:bg-white',
          'dark:hover:bg-gray-50',
          'dark:text-purple-100',
        ],
        danger: ['bg-red-100', 'hover:bg-red-50', 'text-white'],
        icon: ['bg-transparent', 'hover:bg-gray-50', 'dark:hover:bg-gray-200'],
        ghost: ['bg-transparent', 'hover:bg-gray-50', 'dark:hover:bg-gray-200'],
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

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<'button'>

export default function Button({
  variant,
  size,
  children,
  className,
  onClick,
  disabled = false,
  tabIndex,
}: ButtonProps) {
  return (
    <NextUiButton
      tabIndex={tabIndex}
      onClick={onClick}
      disabled={disabled}
      isIconOnly={variant === 'icon'}
      className={twMerge(buttonStyles({ variant, size }), className)}
    >
      {children}
    </NextUiButton>
  )
}
