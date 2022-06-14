import React from 'react';
import { INovuTheme } from '../../store/novu-theme.context';

interface IGradientDotProps {
  props?: React.ComponentPropsWithoutRef<'svg'>;
  theme: INovuTheme;
}

/* eslint-disable */
export function GradientDot(props: IGradientDotProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="6.5"
        fill="url(#paint0_linear_1722_2699)"
        stroke={props.theme.bellGradientDot.color.backgroundColor}
        strokeWidth="3"
      />
      <defs>
        <linearGradient id="paint0_linear_1722_2699" x1="8" y1="13" x2="8" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor={props.theme.bellGradientDot.color.stopColor} />
          <stop offset="1" stopColor={props.theme.bellGradientDot.color.stopColorOffset} />
        </linearGradient>
      </defs>
    </svg>
  );
}
