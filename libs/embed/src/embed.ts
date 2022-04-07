/* eslint no-undef: 0 */
/* eslint promise/param-names: 0 */
/* eslint-disable */
//
import iFrameResize from 'iframe-resizer';
import * as EventTypes from './shared/eventTypes';
import { UnmountedError, DomainVerificationError } from './shared/errors';
import { IFRAME_URL } from './shared/resources';
import { SHOW_WIDGET } from './shared/eventTypes';

const WEASL_WRAPPER_ID = 'novu-container';
const IFRAME_ID = 'novu-iframe-element';

class Novu {
  public clientId: string | unknown;

  private debugMode: boolean;

  private onloadFunc: (b: any) => void;

  private unseenBadgeSelector: string = '';

  private domainAllowed: boolean;

  private selector: string = '';

  private options?: IOptions;

  private iframe: HTMLIFrameElement | undefined;

  private widgetVisible = false;

  private listeners: { [key: string]: (data: any) => void } = {};

  constructor(onloadFunc = function () {}) {
    this.debugMode = false;
    this.onloadFunc = onloadFunc;
    this.domainAllowed = true;
    this.widgetVisible = false;
  }

  on = (name: string, cb: (data: any) => void) => {
    this.listeners[name] = cb;
  };

  init = (
    clientId: string,
    selectorOrOptions: string | IOptions,
    data: { userId: string; lastName: string; firstName: string; email: string }
  ) => {
    const _scope = this;
    if (typeof selectorOrOptions === 'string') {
      this.selector = selectorOrOptions;
    } else {
      this.selector = selectorOrOptions.bellSelector;
      this.unseenBadgeSelector = selectorOrOptions.unseenBadgeSelector;
      this.options = selectorOrOptions;
    }

    this.clientId = clientId;
    this.initializeIframe(clientId, data);
    this.mountIframe();
    const button = document.querySelector(this.selector) as HTMLButtonElement;
    if (button) {
      button.style.position = 'relative';
    }

    const _this = this;
    function positionIframe() {
      const button = document.querySelector(_scope.selector);
      if (!button) {
        return;
      }
      const pos = button.getClientRects()[0];
      if (!pos) {
        hideWidget();
        return;
      }

      const { left } = pos;
      const { top } = pos;
      const wrapper: any = document.querySelector('.wrapper-novu-widget');

      wrapper.style.position = 'absolute';
      if (_this.options?.position?.left) {
        wrapper.style.left = isNaN(_this.options?.position?.left as number)
          ? _this.options?.position?.left
          : `${_this.options?.position?.left}px`;
      } else {
        let leftPosition = left - 350;
        if (leftPosition < 330) {
          leftPosition = left + 350;
        }
        wrapper.style.left = `${leftPosition}px`;
      }

      if (_this.options?.position?.left) {
        wrapper.style.top = isNaN(_this.options?.position?.top as number)
          ? _this.options?.position?.top
          : `${_this.options?.position?.top}px`;
      } else {
        wrapper.style.top = `${top + 50}px`;
      }
    }

    function hideWidget() {
      var elem = document.querySelector('.wrapper-novu-widget') as HTMLBodyElement;

      if (elem) {
        elem.style.display = 'none';
      }
    }

    window.addEventListener('resize', () => {
      positionIframe();
    });

    window.addEventListener('click', (e: any) => {
      if (document.querySelector(this.selector)?.contains(e.target)) {
        this.widgetVisible = !this.widgetVisible;
        positionIframe();

        var elem = document.querySelector('.wrapper-novu-widget') as HTMLBodyElement;

        if (elem) {
          elem.style.display = 'inline-block';
        }

        this.iframe?.contentWindow?.postMessage(
          {
            type: EventTypes.SHOW_WIDGET,
            value: {},
          },
          '*'
        );
      } else {
        hideWidget();
      }
    });
  };

  // PRIVATE METHODS
  ensureMounted = () => {
    if (!document.getElementById(IFRAME_ID)) {
      throw new UnmountedError('novu.init needs to be called first');
    }
  };

  ensureAllowed = () => {
    if (!this.domainAllowed) {
      throw new DomainVerificationError(`${window.location.host} is not permitted to use client ID ${this.clientId}`);
    }
  };

  receiveMessage = (event: any) => {
    if (!!event && !!event.data && !!event.data.type) {
      // eslint-disable-next-line default-case
      switch (event.data.type) {
        case EventTypes.SET_COOKIE:
          document.cookie = event.data.value;
          break;
        case EventTypes.DOMAIN_NOT_ALLOWED:
          this.handleDomainNotAllowed();
          break;
        case EventTypes.BOOTSTRAP_DONE:
          this.handleBootstrapDone();
          break;
      }
    }
  };

  handleBootstrapDone = () => {
    const novuApi = (window as any).novu;
    novuApi._c = (window as any).novu._c;

    this.runPriorCalls();
    (window as any).novu = novuApi;
  };

  handleDomainNotAllowed = () => {
    this.domainAllowed = false;
  };

  initializeIframe = (clientId: string, options: any) => {
    if (!document.getElementById(IFRAME_ID)) {
      const iframe = document.createElement('iframe');
      iframe.onload = () => {
        (iFrameResize as any).iframeResize(
          {
            log: false,
            autoResize: true,
            onMessage: ({ message }: any) => {
              if (message.type === 'unseen_count_changed') {
                if (this.selector) {
                  const parentSel = document.querySelector(`${this.selector}`);
                  const sel = document.querySelector(`${this.selector} .ntf-counter`) as HTMLElement;
                  if (!sel) {
                    if (message.count) {
                      let span = document.createElement('span') as HTMLElement;
                      if (this.options?.unseenBadgeSelector && document.querySelector(this.unseenBadgeSelector)) {
                        span = document.querySelector(this.unseenBadgeSelector) as HTMLElement;
                      }

                      span.classList.add('ntf-counter');
                      (span as any).style =
                        'top: 0; left: 10px; text-align: center; width: 13px; height: 13px; font-size: 9px; line-height: 14px; border-radius: 100%; color: white; background: red; overflow: hidden; z-index: 1000; display: inline-block; ' +
                        (span as any).style;

                      updateInnerTextCount(span, message.count);

                      if (parentSel) {
                        if (!this.options?.unseenBadgeSelector) {
                          (parentSel as any).style.position = 'relative';
                          parentSel.appendChild(span);
                        }
                      }
                    }
                  } else if (!message.count) {
                    sel.remove();
                  } else if (sel) {
                    updateInnerTextCount(sel, message.count);
                  }
                }

                if (this.listeners.on_notification_count_change) {
                  this.listeners.on_notification_count_change(message.count);
                }
              } else if (message.type === 'url_change') {
                window.location.href = message.url;
              } else if (message.type === 'notification_click') {
                if (this.listeners.notification_click) {
                  this.listeners.notification_click(message.notification);
                }
              }
            },
            enablePublicMethods: true, // Enable methods within iframe hosted page
            heightCalculationMethod: 'max',
            widthCalculationMethod: 'max',
            sizeWidth: true,
          },
          `#${IFRAME_ID}`
        );

        this.iframe?.contentWindow?.postMessage(
          {
            type: EventTypes.INIT_IFRAME,
            value: {
              clientId: this.clientId,
              topHost: window.location.host,
              data: options,
            },
          },
          '*'
        );
      };

      iframe.src = `${IFRAME_URL}/${clientId}`;
      iframe.id = IFRAME_ID;
      iframe.style.border = 'none';
      (iframe as any).crossorigin = 'anonymous';
      this.iframe = iframe;
    }
  };

  runPriorCalls = () => {
    const allowedCalls: string[] = [];
    const priorCalls = window.novu && window.novu._c && typeof window.novu._c === 'object' ? window.novu._c : [];
    priorCalls.forEach((call: string[]) => {
      const method: any = call[0];
      const args = call[1];
      if (allowedCalls.includes(method)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (this[method as any] as any).apply(this, args);
      }
    });
    this.onloadFunc.call(window.novu, window.novu);
  };

  mountIframe = () => {
    if (!document.getElementById(IFRAME_ID) && this.iframe) {
      window.addEventListener('message', this.receiveMessage, false);

      const wrapper = document.createElement('div');

      wrapper.className = 'wrapper-novu-widget';
      wrapper.style.display = 'none';
      wrapper.id = WEASL_WRAPPER_ID;
      (
        wrapper as any
      ).style = `z-index: ${Number.MAX_SAFE_INTEGER}; width: 0; height: 0; position: relative; display: none;`;
      wrapper.appendChild(this.iframe);
      document.body.appendChild(wrapper);
    }
  };
}

export default ((window: any) => {
  const onloadFunc =
    window.novu && window.novu.onload && typeof window.novu.onload === 'function' ? window.novu.onload : function () {};

  const initCall = window.novu._c.find((call: string[]) => call[0] === 'init');
  const novuApi: any = () => {};
  const novu = new Novu(onloadFunc);

  novuApi.init = novu.init;
  novuApi.on = novu.on;

  if (initCall) {
    // eslint-disable-next-line prefer-spread
    novuApi[initCall[0]].apply(novuApi, initCall[1]);

    const onCall = window.novu._c.find((call: string[]) => call[0] === 'on');
    if (onCall) {
      novuApi[onCall[0]].apply(novuApi, onCall[1]);
    }
  } else {
    // eslint-disable-next-line no-param-reassign
    (window as any).novu.init = novu.init;

    // eslint-disable-next-line no-param-reassign
    (window as any).novu.on = novu.on;
  }
})(window);

function updateInnerTextCount(element: HTMLElement, count: number) {
  element.innerText = count > 99 ? '99+' : count.toString();
  if (count > 99) {
    (element as any).style.fontSize = '8px';
  }
}

interface IOptions {
  bellSelector: string;
  unseenBadgeSelector: string;
  position?: {
    top?: number | string;
    left?: number | string;
  };
}
