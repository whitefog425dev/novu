import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../config';

export default createStyles((theme: MantineTheme) => {
  const dark = theme.colorScheme === 'dark';

  return {
    arrow: {
      width: '7px',
      height: '7px',
      right: '17px!important',
      backgroundColor: dark ? colors.B20 : colors.B98,
      border: 'none',
    },
    body: {
      backgroundColor: dark ? colors.B20 : colors.B98,
      color: dark ? theme.white : colors.B40,
      border: 'none',
    },
    item: {
      borerRadius: '5px',
      color: `${dark ? theme.white : colors.B40} !important`,
      fontWeight: '400',
      fontSize: '14px',
    },
    itemHovered: {
      backgroundColor: dark ? colors.B30 : colors.B85,
    },
  };
});
