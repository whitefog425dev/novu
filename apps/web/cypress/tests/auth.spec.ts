describe('User Sign-up and Login', function () {
  describe('Sign up', function () {
    beforeEach(function () {
      cy.task('clearDatabase');
      cy.seed();
    });

    it('should allow a visitor to sign-up, login, and logout', function () {
      cy.intercept('**/organization/**/switch').as('appSwitch');
      cy.visit('/auth/signup');
      cy.getByTestId('fullName').type('Test User');
      cy.getByTestId('email').type('example@example.com');
      cy.getByTestId('password').type('usEr_password_123');
      cy.getByTestId('submitButton').click();
      cy.location('pathname').should('equal', '/auth/application');
      cy.getByTestId('app-creation').type('Organization Name');
      cy.getByTestId('submit-btn').click();
      cy.location('pathname').should('equal', '/quickstart');
    });
  });

  describe('Password Reset', function () {
    before(() => {
      cy.initializeSession().as('session');
    });

    it('should request a password reset flow', function () {
      cy.visit('/auth/reset/request');
      cy.getByTestId('email').type(this.session.user.email);
      cy.getByTestId('submit-btn').click();
      cy.getByTestId('success-screen-reset').should('be.visible');
      cy.task('passwordResetToken', this.session.user._id).then((token) => {
        cy.visit('/auth/reset/' + token);
      });
      cy.getByTestId('password').type('123e3e3e3');
      cy.getByTestId('password-repeat').type('123e3e3e3');

      cy.getByTestId('submit-btn').click();
    });
  });

  describe('Login', function () {
    beforeEach(function () {
      cy.task('clearDatabase');
      cy.seed();
    });

    it('should redirect to the dashboard page when a token exists in query', function () {
      cy.initializeSession({ disableLocalStorage: true }).then((session) => {
        cy.visit('/auth/login?token=' + session.token);
        cy.location('pathname').should('equal', '/templates');
      });
    });

    it('should be redirect login with no auth', function () {
      cy.visit('/');
      cy.location('pathname').should('equal', '/auth/login');
    });

    it('should successfully login the user', function () {
      cy.visit('/auth/login');

      cy.getByTestId('email').type('test-user-1@example.com');
      cy.getByTestId('password').type('123qwe!@#');
      cy.getByTestId('submit-btn').click();
      cy.location('pathname').should('equal', '/templates');
    });

    it('should show bad password error when authenticating with bad credentials', function () {
      cy.visit('/auth/login');

      cy.getByTestId('email').type('test-user-1@example.com');
      cy.getByTestId('password').type('123456');
      cy.getByTestId('submit-btn').click();
      cy.get('.mantine-PasswordInput-error').contains('Invalid password');
    });

    it('should show invalid email error when authenticating with invalid email', function () {
      cy.visit('/auth/login');

      cy.getByTestId('email').type('test-user-1@example.c');
      cy.getByTestId('password').type('123456');
      cy.getByTestId('submit-btn').click();
      cy.get('.mantine-TextInput-error').contains('Please provide a valid email');
    });

    it('should show invalid email error when authenticating with invalid email', function () {
      cy.visit('/auth/login');

      cy.getByTestId('email').type('test-user-1@example.de');
      cy.getByTestId('password').type('123456');
      cy.getByTestId('submit-btn').click();
      cy.get('.mantine-TextInput-error').contains('Account does not exist');
    });
  });

  describe('Logout', function () {
    beforeEach(function () {
      cy.task('clearDatabase');
      cy.seed();
    });

    it('should logout user when auth token is expired', function () {
      // login the user
      cy.visit('/auth/login');
      cy.getByTestId('email').type('test-user-1@example.com');
      cy.getByTestId('password').type('123qwe!@#');
      cy.getByTestId('submit-btn').click();

      // setting current time in future, to simulate expired token
      var todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() + 30); // iat - exp = 30 days
      cy.clock(todaysDate);

      cy.visit('/templates');

      // checkig if token is removed from local storage
      cy.getLocalStorage('auth_token').should('be.null');
      // checking if user is redirected to login page
      cy.location('pathname').should('equal', '/auth/login');
    });
  });
});
