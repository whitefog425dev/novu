import { Badge, createStyles, MantineTheme } from '@mantine/core';
import { INovuTheme } from '../../../../../store/novu-theme.context';
import { ICommonTheme } from '../../../../../store/novu-theme-provider.context';
import { colors } from '../../../../../shared/config/colors';

export default createStyles(
  (theme: MantineTheme, { novuTheme, common }: { novuTheme: INovuTheme; common: ICommonTheme }, getRef) => {
    const tabLabel = getRef('tabLabel');
    const tabIcon = getRef('tabIcon');

    return {
      tabsListWrapper: {
        borderBottom: '1px solid ' + (theme.colorScheme === 'dark' ? colors.B20 : colors.B98),
      },
      tabsList: {
        gap: '30px',
        padding: '15px',
        paddingBottom: 0,
      },

      tabControl: {
        marginBottom: '0',
        padding: '0px',
        height: '36px',
        [`.mantine-Badge-root`]: {
          background: 'transparent',
          border: '1px solid ' + colors.B60,
          color: colors.B60,
        },
      },

      tabActive: {
        width: 'auto',
        [`.mantine-Badge-root`]: {
          background: novuTheme.header?.badgeColor,
          border: 'none',
          color: novuTheme.header?.badgeTextColor,
        },
        [`& .${tabLabel}`]: {
          color: novuTheme.header?.fontColor,

          '&::after': {
            content: '""',
            display: 'block',
            height: '2px',
            background: novuTheme.header?.badgeColor,
            borderRadius: '10px',
          },
        },

        [`& .${tabIcon}`]: {
          color: 'red',
          background: novuTheme.header?.badgeColor,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      },

      tabInner: {
        display: 'block',
        cursor: 'pointer',

        '&:hover': {
          [`& .${tabIcon}`]: {
            color: novuTheme.header?.fontColor,
          },

          [`& .${tabLabel}`]: {
            color: novuTheme.header?.fontColor,
          },
        },
      },

      tabLabel: {
        ref: tabLabel,
        fontFamily: common.fontFamily,
        fontSize: '14px',
        fontWeight: 700,
        color: colors.B60,
        textAlign: 'left',
      },

      tabIcon: {
        ref: tabIcon,

        display: 'block',
        fontSize: '26px',
        fontWeight: 700,
        marginBottom: '5px',
        color: colors.B60,
        textAlign: 'left',
      },
    };
  }
);
