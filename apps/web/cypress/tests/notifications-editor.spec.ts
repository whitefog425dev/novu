import { ChannelTypeEnum, INotificationTemplate } from '@novu/shared';

describe('Notifications Creator', function () {
  beforeEach(function () {
    cy.initializeSession().as('session');
  });

  describe('workflow editor - drag and drop', function () {
    it('should drag and drop channel', function () {
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test drag and drop channel');
      cy.getByTestId('workflowButton').click({ force: true });
      dragAndDrop('inApp');
      dragAndDrop('inApp', 'inApp');

      cy.wait(100);
      cy.getByTestId('node-inAppSelector').last().parent().click({ force: true });
      cy.getByTestId('edit-template-channel').click({ force: true });
    });

    it('should not be able to drop when not on last node', function () {
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test only drop on last node');
      cy.getByTestId('workflowButton').click({ force: true });
      dragAndDrop('inApp');
      dragAndDrop('email', 'trigger');
      cy.wait(100);
      cy.getByTestId('node-emailSelector').should('not.exist');
      cy.get('.react-flow__node').should('have.length', 2);
    });

    it('should be able to select a step', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);
      fillBasicNotificationDetails('Test SMS Notification Title');
      cy.getByTestId('workflowButton').click({ force: true });
      cy.getByTestId(`node-inAppSelector`).click({ force: true }).parent().should('have.class', 'selected');
      cy.getByTestId(`step-properties-side-menu`).should('be.visible');
      cy.getByTestId(`node-triggerSelector`).click({ force: true });
      cy.getByTestId(`drag-side-menu`).should('be.visible');
      cy.getByTestId(`node-inAppSelector`).parent().should('not.have.class', 'selected');
    });
  });

  describe('workflow editor - main functionality', function () {
    it('should not reset data when switching channel types', function () {
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test not reset data when switching channel types');

      addAndEditChannel('inApp');
      cy.getByTestId('in-app-editor-content-input').type('{{firstName}} someone assigned you to {{taskName}}', {
        parseSpecialCharSequences: false,
      });
      goBack();

      dragAndDrop('email', 'inApp');
      editChannel('email');
      cy.getByTestId('editable-text-content').clear().type('This text is written from a test {{firstName}}', {
        parseSpecialCharSequences: false,
      });
      cy.getByTestId('emailSubject').type('this is email subject');
      goBack();

      editChannel('inApp');
      cy.getByTestId('in-app-editor-content-input').contains('someone assigned you to');
      goBack();
      editChannel('email');

      cy.getByTestId('editable-text-content').contains('This text is written from a test');
      cy.getByTestId('emailSubject').should('have.value', 'this is email subject');
    });

    it('should create in-app notification', function () {
      cy.visit('/templates/create');
      cy.getByTestId('title').type('Test Notification Title');
      cy.getByTestId('description').type('This is a test description for a test title');
      cy.get('body').click();
      cy.getByTestId('trigger-code-snippet').should('not.exist');
      cy.getByTestId('groupSelector').should('have.value', 'General');

      addAndEditChannel('inApp');

      cy.getByTestId('in-app-editor-content-input').type('{{firstName}} someone assigned you to {{taskName}}', {
        parseSpecialCharSequences: false,
      });
      cy.getByTestId('inAppRedirect').type('/example/test');
      cy.getByTestId('submit-btn').click();

      cy.getByTestId('success-trigger-modal').should('be.visible');
      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('test-notification');
      cy.getByTestId('success-trigger-modal')
        .getByTestId('trigger-code-snippet')
        .contains("import { Novu } from '@novu/node'");

      cy.get('.mantine-Tabs-tabsList').contains('Curl').click();
      cy.getByTestId('success-trigger-modal')
        .getByTestId('trigger-curl-snippet')
        .contains("--header 'Authorization: ApiKey");

      cy.getByTestId('success-trigger-modal').getByTestId('trigger-curl-snippet').contains('taskName');

      cy.getByTestId('trigger-snippet-btn').click();
      cy.location('pathname').should('equal', '/templates');
    });
    it('should create email notification', function () {
      cy.visit('/templates/create');
      cy.getByTestId('title').type('Test Notification Title');
      cy.getByTestId('description').type('This is a test description for a test title');
      cy.get('body').click();

      addAndEditChannel('email');

      cy.getByTestId('email-editor').getByTestId('editor-row').click();
      cy.getByTestId('control-add').click({ force: true });
      cy.getByTestId('add-btn-block').click();
      cy.getByTestId('button-block-wrapper').should('be.visible');
      cy.getByTestId('button-block-wrapper').find('button').click();
      cy.getByTestId('button-text-input').clear().type('Example Text Of {{ctaName}}', {
        parseSpecialCharSequences: false,
      });
      cy.getByTestId('button-block-wrapper').find('button').contains('Example Text Of {{ctaName}}');
      cy.getByTestId('editable-text-content').clear().type('This text is written from a test {{firstName}}', {
        parseSpecialCharSequences: false,
      });

      cy.getByTestId('email-editor').getByTestId('editor-row').eq(1).click();
      cy.getByTestId('control-add').click({ force: true });
      cy.getByTestId('add-text-block').click();
      cy.getByTestId('editable-text-content').eq(1).clear().type('This another text will be {{customVariable}}', {
        parseSpecialCharSequences: false,
      });
      cy.getByTestId('editable-text-content').eq(1).click();

      cy.getByTestId('settings-row-btn').eq(1).invoke('show').click();
      cy.getByTestId('remove-row-btn').click();
      cy.getByTestId('button-block-wrapper').should('not.exist');

      cy.getByTestId('emailSubject').type('this is email subject');

      cy.getByTestId('submit-btn').click();

      cy.getByTestId('success-trigger-modal').should('be.visible');
      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('test-notification');
      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('firstName:');
      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('customVariable:');
    });

    it('should create and edit group id', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);

      cy.getByTestId('groupSelector').click();
      cy.getByTestId('groupSelector').clear();
      cy.getByTestId('groupSelector').type('New Test Category');
      cy.getByTestId('submit-category-btn').click();
      cy.getByTestId('groupSelector').should('have.value', 'New Test Category');

      cy.wait(500);

      cy.getByTestId('submit-btn').click();

      cy.visit('/templates');
      cy.getByTestId('template-edit-link');
      cy.visit('/templates/edit/' + template._id);

      cy.getByTestId('groupSelector').should('have.value', 'New Test Category');
    });

    it('should edit notification', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);
      cy.getByTestId('title').should('have.value', template.name);

      addAndEditChannel('inApp');

      cy.getByTestId('in-app-editor-content-input')
        .getByTestId('in-app-editor-content-input')
        .contains('Test content for {{firstName}}');

      goBack();
      goBack();

      cy.getByTestId('settingsButton').click({ force: true });
      cy.getByTestId('title').clear().type('This is the new notification title');
      cy.getByTestId('workflowButton').click({ force: true });
      cy.wait(1000);
      editChannel('inApp');

      cy.getByTestId('in-app-editor-content-input').clear().type('new content for notification');
      cy.getByTestId('submit-btn').click();

      cy.visit('/templates');
      cy.getByTestId('template-edit-link');
      cy.getByTestId('notifications-template').get('tbody tr td').contains('This is the new', {
        matchCase: false,
      });
    });

    it('should update notification active status', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);
      cy.getByTestId('active-toggle-switch').get('label').contains('Enabled');
      cy.getByTestId('active-toggle-switch').click();
      cy.getByTestId('active-toggle-switch').get('label').contains('Disabled');

      cy.visit('/templates/edit/' + template._id);
      cy.getByTestId('active-toggle-switch').get('label').contains('Disabled');
    });

    it('should toggle active states of channels', function () {
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test toggle active states of channels');
      // Enable email from button click
      cy.getByTestId('workflowButton').click({ force: true });
      dragAndDrop('email');

      cy.getByTestId(`node-emailSelector`).click({ force: true });

      cy.get('.mantine-Switch-input').should('have.value', 'on');
      cy.get('.mantine-Switch-input').click({ force: true });

      // enable email selector
      cy.get('.mantine-Switch-input').click();
      cy.getByTestId(`close-side-menu-btn`).click({ force: true });

      dragAndDrop('inApp', 'email');

      cy.getByTestId(`node-inAppSelector`).click({ force: true });
      cy.get('.mantine-Switch-input').should('have.value', 'on');
    });

    it.skip('should show trigger snippet block when editing', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);

      cy.getByTestId('triggerCodeSelector').click({ force: true });
      cy.getByTestId('trigger-code-snippet').contains('test-event');
    });

    it('should validate form inputs', function () {
      cy.visit('/templates/create');
      cy.getByTestId('description').type('this is a notification template description');
      cy.getByTestId('submit-btn').click();
      cy.getByTestId('title').should('have.class', 'mantine-TextInput-invalid');
      fillBasicNotificationDetails('Test SMS Notification Title');
      cy.getByTestId('workflowButton').click({ force: true });
      dragAndDrop('inApp');
      goBack();

      cy.getByTestId('submit-btn').click();
      cy.getByTestId('workflowButton').getByTestId('error-circle').should('be.visible');
      cy.getByTestId('settingsButton').getByTestId('error-circle').should('be.visible');
    });

    it('should allow uploading a logo from email editor', function () {
      cy.intercept(/.*organizations\/me.*/, (r) => {
        r.continue((res) => {
          if (res.body) {
            delete res.body.data.branding.logo;
          }

          res.send({ body: res.body });
        });
      });
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test allow uploading a logo from email editor');
      addAndEditChannel('email');

      cy.getByTestId('logo-upload-button').click();

      cy.get('.mantine-Modal-modal button').contains('Yes').click({ force: true });
      cy.get('.mantine-Modal-modal button').contains('Yes').click({ force: true });
      cy.location('pathname').should('equal', '/settings');
    });

    it('should show the brand logo on main page', function () {
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test show the brand logo on main page');
      addAndEditChannel('email');

      cy.getByTestId('email-editor')
        .getByTestId('brand-logo')
        .should('have.attr', 'src', 'https://novu.co/img/logo.png');
    });

    it('should support RTL text content', function () {
      cy.visit('/templates/create');
      fillBasicNotificationDetails('Test support RTL text content');
      cy.getByTestId('workflowButton').click({ force: true });
      dragAndDrop('email');
      editChannel('email');

      cy.getByTestId('settings-row-btn').eq(0).invoke('show').click();
      cy.getByTestId('editable-text-content').should('have.css', 'direction', 'ltr');
      cy.getByTestId('align-right-btn').click();
      cy.getByTestId('editable-text-content').should('have.css', 'direction', 'rtl');
    });

    it('should create an SMS channel message', function () {
      cy.visit('/templates/create');

      fillBasicNotificationDetails('Test SMS Notification Title');
      addAndEditChannel('sms');

      cy.getByTestId('smsNotificationContent').type('{{firstName}} someone assigned you to {{taskName}}', {
        parseSpecialCharSequences: false,
      });
      cy.getByTestId('submit-btn').click();

      cy.getByTestId('success-trigger-modal').should('be.visible');
      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('test-sms-notification');
      cy.getByTestId('success-trigger-modal')
        .getByTestId('trigger-code-snippet')
        .contains("import { Novu } from '@novu/node'");

      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('taskName');

      cy.getByTestId('success-trigger-modal').getByTestId('trigger-code-snippet').contains('firstName');

      cy.getByTestId('trigger-snippet-btn').click();
      cy.location('pathname').should('equal', '/templates');
    });

    it('should save HTML template email', function () {
      cy.visit('/templates/create');

      fillBasicNotificationDetails('Custom Code HTML Notification Title');
      addAndEditChannel('email');

      cy.getByTestId('emailSubject').type('this is email subject');

      cy.getByTestId('editor-type-selector')
        .find('.mantine-Tabs-tabControl')
        .contains('Custom Code', { matchCase: false })
        .click();
      cy.get('#codeEditor').type('Hello world code {{name}} <div>Test', { parseSpecialCharSequences: false });
      cy.getByTestId('submit-btn').click();
      cy.wait(1000);
      cy.getByTestId('trigger-snippet-btn').click();

      cy.get('tbody').contains('Custom Code HTM').click();

      cy.getByTestId('workflowButton').click({ force: true });
      editChannel('email');
      cy.get('#codeEditor').contains('Hello world code {{name}} <div>Test</div>');
    });

    it('should redirect to dev env for edit template', async function () {
      cy.intercept('POST', '*/notification-templates').as('createTemplate');
      cy.visit('/templates/create');

      fillBasicNotificationDetails();
      cy.getByTestId('submit-btn').click();

      cy.wait('@createTemplate').then((res) => {
        cy.getByTestId('trigger-snippet-btn').click();

        cy.visit('/changes');
        cy.getByTestId('promote-btn').eq(0).click({ force: true });
        cy.wait(500);

        cy.getByTestId('environment-switch').find(`input[value="Production"]`).click({ force: true });
        cy.wait(500);
        cy.getByTestId('notifications-template').find('tbody tr').first().click({ force: true });

        cy.location('pathname').should('not.equal', `/templates/edit/${res.response?.body.data._id}`);

        cy.getByTestId('environment-switch').find(`input[value="Development"]`).click({ force: true });
        cy.wait(500);
        cy.location('pathname').should('equal', `/templates/edit/${res.response?.body.data._id}`);
      });
    });

    it('should be able to delete a step', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);
      cy.wait(500);
      cy.getByTestId('workflowButton').click({ force: true });
      cy.get('.react-flow__node').should('have.length', 3);
      cy.getByTestId('step-actions-dropdown')
        .first()
        .click({ force: true })
        .getByTestId('delete-step-action')
        .click({ force: true });
      cy.getByTestId(`node-inAppSelector`).should('not.exist');
      cy.get('.react-flow__node').should('have.length', 2);
      cy.get('.react-flow__node').first().should('contain', 'Trigger').next().should('contain', 'Email');
      cy.getByTestId('submit-btn').click();
      cy.visit('/templates/edit/' + template._id);
      cy.wait(500);
      cy.getByTestId('workflowButton').click({ force: true });
      cy.get('.react-flow__node').should('have.length', 2);
    });

    it('should keep steps order on reload', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);
      cy.wait(500);
      cy.getByTestId('workflowButton').click({ force: true });
      dragAndDrop('sms', 'email');

      editChannel('sms');
      cy.getByTestId('smsNotificationContent').type('new content for sms');
      cy.getByTestId('submit-btn').click();
      cy.visit('/templates/edit/' + template._id);
      cy.wait(500);
      cy.getByTestId('workflowButton').click({ force: true });
      cy.get('.react-flow__node').should('have.length', 4);
      cy.get('.react-flow__node')
        .first()
        .should('contain', 'Trigger')
        .next()
        .should('contain', 'In-App')
        .next()
        .should('contain', 'Email')
        .next()
        .should('contain', 'SMS');
    });

    it('should be able to disable step', function () {
      const template = this.session.templates[0];
      cy.visit('/templates/edit/' + template._id);
      cy.wait(500);
      cy.getByTestId('workflowButton').click({ force: true });
      cy.getByTestId(`node-inAppSelector`).click({ force: true });
      cy.getByTestId(`step-properties-side-menu`).find('.mantine-Switch-input').get('label').contains('Active');
      cy.getByTestId(`step-properties-side-menu`).find('.mantine-Switch-input').click({ force: true });
      cy.getByTestId('submit-btn').click();
      cy.getByTestId(`node-inAppSelector`).click({ force: true });
      cy.getByTestId(`step-properties-side-menu`).find('.mantine-Switch-input').get('label').contains('Disabled');
    });
  });
});

function addAndEditChannel(channel: 'inApp' | 'email' | 'sms') {
  cy.getByTestId('workflowButton').click({ force: true });
  dragAndDrop(channel);
  editChannel(channel);
}

function dragAndDrop(channel: 'inApp' | 'email' | 'sms', parent?: 'inApp' | 'email' | 'sms' | 'trigger') {
  const dataTransfer = new DataTransfer();

  cy.wait(1000);
  cy.getByTestId(`dnd-${channel}Selector`).trigger('dragstart', { dataTransfer, force: true });
  if (parent) {
    cy.getByTestId(`node-${parent}Selector`).parent().trigger('drop', { dataTransfer, force: true });
  } else {
    cy.getByTestId('node-triggerSelector').parent().trigger('drop', { dataTransfer, force: true });
  }
}
function editChannel(channel: 'inApp' | 'email' | 'sms') {
  cy.getByTestId(`node-${channel}Selector`).click({ force: true });
  cy.getByTestId('edit-template-channel').click({ force: true });
}

function goBack() {
  cy.getByTestId('go-back-button').click({ force: true });
}

function fillBasicNotificationDetails(title?: string) {
  cy.getByTestId('title').type(title || 'Test Notification Title');
  cy.getByTestId('description').type('This is a test description for a test title');
}
