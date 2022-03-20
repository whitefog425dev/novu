import { createStyles } from '@mantine/core';
import { colors, shadows } from '../config';

export const useStyles = createStyles((theme) => {
  const dark = theme.colorScheme === 'dark';

  return {
    active: {
      background: `${dark ? getGradient(colors.B20) : getGradient(colors.white)} padding-box, ${
        colors.horizontal
      } border-box`,
      border: '1px solid transparent',
      boxShadow: dark ? shadows.dark : shadows.light,
    },
    button: {
      height: '75px',
      width: '100%',
      margin: '0px',
      marginBottom: '20px',
      padding: '20px',
      paddingLeft: '10px',
      backgroundColor: dark ? colors.B17 : colors.B98,
      borderRadius: '7px',
      fontWeight: '700',

      '&:hover': {
        backgroundColor: dark ? colors.B20 : colors.BGLight,
      },
    },
    linkIcon: {
      marginLeft: '5px',
      color: dark ? colors.B40 : colors.B70,
      '& *': {
        display: 'block',
      },
    },
  };
});

const getGradient = (color) => `linear-gradient(0deg, ${color} 0%, ${color} 100%)`;
