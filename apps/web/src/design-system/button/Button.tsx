import React from 'react';
import { Button as MantineButton, MantineMargins, SharedButtonProps } from '@mantine/core';
import useStyles from './Button.styles';

interface IButtonProps extends JSX.ElementChildrenAttribute, MantineMargins {
  loading?: boolean;
  size?: 'md' | 'lg';
  variant?: 'outline' | 'filled';
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  submit?: boolean;
  onClick?: () => void;
  inherit?: boolean;
}

/**
 * Button component
 *
 */
export function Button({
  loading,
  children,
  submit = false,
  icon,
  size = 'md',
  fullWidth,
  disabled = false,
  inherit = false,
  onClick,
  ...props
}: IButtonProps) {
  const { classes } = useStyles({ disabled, inherit });
  const defaultDesign = { radius: 'md', classNames: classes } as SharedButtonProps;
  const withIconProps = icon ? { leftIcon: icon } : {};

  return (
    <MantineButton
      {...defaultDesign}
      {...withIconProps}
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}
      size={size}
      loading={loading}
      fullWidth={fullWidth}
      {...props}>
      {children}
    </MantineButton>
  );
}
