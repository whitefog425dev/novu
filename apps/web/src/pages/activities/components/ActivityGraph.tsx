import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getActivityGraphStats } from '../../../api/activity';
import { colors, Text } from '../../../design-system';
import { IActivityGraphStats, IChartData } from '../interfaces';
import { activityGraphStatsMock } from '../consts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function checkIsTriggerSent(activityGraphStats: IActivityGraphStats[] | undefined) {
  return activityGraphStats?.length && activityGraphStats?.length > 0;
}

export function ActivityGraph() {
  const [isTriggerSent, setIsTriggerSent] = useState<boolean>(false);
  const { data: activityGraphStats, isLoading: loadingActivityStats } = useQuery<IActivityGraphStats[]>(
    'activityGraphStats',
    getActivityGraphStats
  );

  useEffect(() => {
    if (checkIsTriggerSent(activityGraphStats)) {
      setIsTriggerSent(true);
    }
  }, [activityGraphStats]);

  return (
    <Wrapper>
      {!isTriggerSent ? (
        <MessageContainer>
          <StyledTitle>YOUR ACTIVITY FEED</StyledTitle>
          <StyledText>Here you will see the activity graph once you send some events</StyledText>
        </MessageContainer>
      ) : null}

      {!loadingActivityStats ? (
        <StyledBar
          isTriggerSent={isTriggerSent}
          options={options(isTriggerSent)}
          data={getDataChartJs(activityGraphStats)}
        />
      ) : null}
    </Wrapper>
  );
}

function buildChartDataContainer(data: IActivityGraphStats[]): IChartData {
  return {
    labels: buildChartDateLabels(data),
    datasets: [
      {
        backgroundColor: createGradientColor(),
        data: buildChartData(data),
        borderRadius: 7,
      },
    ],
  };
}

function getDataChartJs(data: IActivityGraphStats[] | undefined): IChartData {
  if (!data || data?.length === 0) {
    return buildChartDataContainer(activityGraphStatsMock);
  }

  return buildChartDataContainer(data);
}

function options(this: any, isTriggerSent: boolean) {
  return {
    maintainAspectRatio: false,
    responsive: true,
    height: 300,

    legend: {
      display: false,
    },

    scales: getScalesConfiguration.call(this),

    plugins: {
      tooltip: isTriggerSent ? getTooltipConfiguration() : { enabled: false },
      legend: hideTitle(),
    },
  };
}

function getScalesConfiguration() {
  return {
    x: {
      reverse: true,
      grid: {
        display: false,
      },
      ticks: {
        callback(val, index) {
          return hideEverySecondTickLabel.call(this, index, val);
        },
      },
    },
    y: {
      display: false,
    },
  };
}

function hideTitle() {
  return {
    display: false,
  };
}

function getTooltipConfiguration() {
  return {
    legend: {
      display: false,
    },

    // Disable the on-canvas tooltip
    enabled: false,

    external: (context) => {
      // Tooltip Element
      let tooltipEl = document.getElementById('chartjs-tooltip');

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        document.body.appendChild(tooltipEl);
      }

      // Hide if no tooltip
      const tooltipModel = context.tooltip;
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';

        return;
      }

      // Set caret Position
      tooltipEl.classList.remove('above', 'below', 'no-transform');
      if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
      } else {
        tooltipEl.classList.add('no-transform');
      }

      function getBody(bodyItem) {
        return bodyItem.lines;
      }

      // Set Text
      if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(getBody);

        let innerHtml = '';

        innerHtml = buildTitle(innerHtml, titleLines);

        innerHtml = buildBody(innerHtml, bodyLines);

        updateTableInnerHtml(tooltipEl, innerHtml);
      }

      updateToolTipStyles(context, tooltipEl, tooltipModel);
    },
  };
}

function createGradientColor() {
  return (context: ScriptableContext<'bar'>) => {
    const { ctx } = context.chart;
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);

    gradient.addColorStop(0, '#DD2476');
    gradient.addColorStop(1, '#FF512F');

    return gradient;
  };
}

function hideEverySecondTickLabel(this: any, index, val) {
  return index % 2 === 0 ? this.getLabelForValue(val) : '';
}

function buildChartDateLabels(data: IActivityGraphStats[]): string[][] {
  return data.map((x) => {
    const titleDate = moment(x._id);

    return [titleDate.format('ddd'), `${titleDate.date()}/${titleDate.month() + 1}`];
  });
}

function buildChartData(data: IActivityGraphStats[]) {
  return data.map((x) => {
    return x.count;
  });
}

const StyledBar = styled(Bar)<{ isTriggerSent: boolean }>`
  height: 175px;
  filter: ${({ isTriggerSent }) => (!isTriggerSent ? 'blur(4px)' : 'blur(0px)')};
`;

const Wrapper = styled.div`
  background: rgba(30, 30, 38, 0.5);
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledTitle = styled(Text)`
  color: #dd2476; // ${colors.horizontal};
  font-size: 11px;
  margin: 12px 0 8px 0;
`;

const StyledText = styled(Text)`
  margin: 0 15px 14px 15px;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  padding: 12px 15px 14px;
  height: 64px;
  background: ${colors.B20};
  border-radius: 7px;
`;

function buildDisplayTitle(title) {
  const dayMonth = title.split(',')[1].split('/');
  const dateString = `1992-0${dayMonth[1]}-${dayMonth[0]}T00:00:00-00:00`;
  const data = moment(dateString);

  return `${data.format('dddd')}, ${data.format('MMMM')} ${data.format('Do')}`;
}

function getTitleStyle() {
  let titleStyle = 'display: flex;';

  titleStyle += 'justify-content: center;';
  titleStyle += '; height: 17px';
  titleStyle += '; margin-bottom: 4px';
  titleStyle += '; border-width: 22px';
  titleStyle += '; border-width: 22px';
  titleStyle += `; color: ${colors.B60}`;

  return titleStyle;
}

function getBodyStyle() {
  let style = 'position: static';

  style += '; display: flex;';
  style += '; justify-content: center;';
  style += '; height: 17px';
  style += '; border-width: 22px';
  style += `; color: #FF512F`;

  return style;
}

function buildTitle(html: string, titleLines: any[]) {
  let resHtml = html;

  resHtml += '<div class="tooltip-title">';

  titleLines.forEach(function (title) {
    const displayTitle = buildDisplayTitle(title);

    const titleStyle = getTitleStyle();

    resHtml += `<span style="${titleStyle}" >${displayTitle}</th></tr>`;
  });
  resHtml += '</div>';

  return resHtml;
}

function getBodyText(body: string[]): string | string[] {
  const total = body.find((x) => x.toLowerCase().includes('total'));
  if (total) {
    const count = total.split(':')[1];

    return `${count} Total`;
  }

  return body;
}

function buildBody(html: string, bodyLines) {
  let resHtml = html;

  resHtml += '<div class="tooltip-body">';
  bodyLines.forEach(function (body) {
    const style = getBodyStyle();

    const bodyText = getBodyText(body);

    resHtml += `<span style="${style}">${bodyText}</span>`;
  });
  resHtml += '</div>';

  return resHtml;
}

function updateTableInnerHtml(tooltipEl: HTMLElement, innerHtml: string) {
  const tableRoot = tooltipEl.querySelector('table');

  if (tableRoot) {
    tableRoot.innerHTML = innerHtml;
  }
}

function updateToolTipStyles(context, tooltipEl: HTMLElement, tooltipModel) {
  const position = context.chart.canvas.getBoundingClientRect();

  /* eslint-disable no-param-reassign */
  tooltipEl.style.background = colors.B20;
  tooltipEl.style.borderRadius = '7px';
  tooltipEl.style.padding = '12px 15px 14px 15px';
  tooltipEl.style.opacity = '1';
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
  tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
  tooltipEl.style.pointerEvents = 'none';
  /* eslint-enable no-param-reassign */
}
