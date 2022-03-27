/// <reference types="cypress" />

type ICreateNotificationTemplateDto = import('@notifire/shared').ICreateNotificationTemplateDto;

declare namespace Cypress {
  interface Chainable {
    getByTestId(dataTestAttribute: string, args?: any): Chainable<Element>;
    getBySelectorLike(dataTestPrefixAttribute: string, args?: any): Chainable<Element>;

    /**
     *  Window object with additional properties used during test.
     */
    window(options?: Partial<Loggable & Timeoutable>): Chainable<CustomWindow>;

    seed(): Chainable<any>;

    clear(): Chainable<any>;
    /**
     * Logs-in user by using UI
     */
    login(username: string, password: string): void;

    /**
     * Logs-in user by using API request
     */
    initializeSession(settings?: {
      noApplication?: boolean;
      disableLocalStorage?: boolean;
      partialTemplate?: Partial<ICreateNotificationTemplateDto>;
    }): Chainable<Response>;
  }
}
