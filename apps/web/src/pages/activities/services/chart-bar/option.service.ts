import moment from 'moment';

export function getOptions(this: any, isTriggerSent: boolean, daysCount: number) {
  return {
    maintainAspectRatio: false,
    responsive: true,
    height: 300,

    legend: {
      display: false,
    },

    scales: getScalesConfiguration.call(this, daysCount),

    plugins: {
      tooltip: getTooltipConfiguration(),
      legend: hideTitle(),
    },
  };
}

function hideTitle() {
  return {
    display: false,
  };
}

function getScalesConfiguration(daysCount: number) {
  return {
    x: {
      reverse: true,
      grid: {
        display: false,
      },
      ticks: {
        callback(value, index) {
          if (daysCount < 8) {
            return showLabel.call(this, value);
          }

          return hideEverySecondTickLabel.call(this, index, value);
        },
      },
    },
    y: {
      display: false,
    },
  };
}

function hideEverySecondTickLabel(this: any, index, val) {
  return index % 2 === 0 ? this.getLabelForValue(val) : '';
}

function showLabel(this: any, value) {
  return this.getLabelForValue(value);
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

      function getBody(bodyItem: string[]): string[] {
        return bodyItem;
      }

      // Set Text
      if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(
          (x: { before: string[]; after: string[]; lines: string[] }): string[] => {
            return getBody(x.lines);
          }
        );

        let innerHtml = '';

        innerHtml = buildTitle(innerHtml, titleLines);

        innerHtml = buildBody(innerHtml, bodyLines);

        updateTableInnerHtml(tooltipEl, innerHtml);
      }

      updateToolTipStyles(context, tooltipEl, tooltipModel);
    },
  };
}

function buildTitle(html: string, titleLines: string[]) {
  let resHtml = html;

  resHtml += '<div class="tooltip-title">';

  titleLines.forEach(function (title) {
    const displayTitle = buildDisplayTitle(title);

    resHtml += `<span >${displayTitle}</th></tr>`;
  });
  resHtml += '</div>';

  return resHtml;
}

function buildBody(html: string, bodyLines) {
  let resHtml = html;

  resHtml += '<div class="tooltip-body">';
  bodyLines.forEach(function (body) {
    const bodyText = getBodyText(body);

    resHtml += `<span >${bodyText}</span>`;
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
  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = `${position.left + window.scrollX + tooltipModel.caretX - tooltipModel.width - 40}px`;
  tooltipEl.style.top = `${position.top + window.scrollY + tooltipModel.caretY - tooltipModel.height - 30}px`;
  /* eslint-enable no-param-reassign */
}

function getBodyText(body: string[]): string | string[] {
  const total = body.find((x) => x.toLowerCase().includes('total'));
  if (total) {
    const count = total.split(':')[1];

    return `${count} Total`;
  }

  return body;
}

function buildDisplayTitle(title) {
  const dayMonth = title.split(',')[1].split('/');
  const dateString = `1992-0${dayMonth[1]}-${dayMonth[0]}T00:00:00-00:00`;
  const data = moment(dateString);

  return `${data.format('dddd')}, ${data.format('MMMM')} ${data.format('Do')}`;
}
