describe('Activity page', function () {
  beforeEach(function () {
    // @ts-ignore
    cy.initializeSession()
      .as('session')
      .then((session: any) => {
        cy.wait(500);

        cy.task('createIntegration', {
          organizationId: session.organization._id,
          applicationId: session.application._id,
        });

        return cy.task('createNotifications', {
          identifier: session.templates[0].triggers[0].identifier,
          token: session.token,
          count: 25,
          organizationId: session.organization._id,
          applicationId: session.application._id,
        });
      });
  });

  it('should display email available for connection', function () {
    cy.visit('/activities');
    cy.location('pathname').should('equal', '/activities');

    // @ts-ignore
    cy.getByTestId('activity-stats-weekly-sent').contains('50');
  });
});
