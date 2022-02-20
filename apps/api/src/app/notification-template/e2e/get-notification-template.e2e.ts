import { expect } from 'chai';
import { NotificationTemplateService, UserSession } from '@notifire/testing';
import { INotificationTemplate } from '@notifire/shared';

describe('Get notification template by id - /notification-templates/:templateId (GET)', async () => {
  let session: UserSession;

  before(async () => {
    session = new UserSession();
    await session.initialize();
  });

  it('should return the template by its id', async function () {
    const notificationTemplateService = new NotificationTemplateService(
      session.user._id,
      session.organization._id,
      session.application._id
    );
    const template = await notificationTemplateService.createTemplate();
    const { body } = await session.testAgent.get(`/v1/notification-templates/${template._id}`);

    const foundTemplate: INotificationTemplate = body.data;

    expect(foundTemplate._id).to.equal(template._id);
    expect(foundTemplate.name).to.equal(template.name);
    expect(foundTemplate.messages.length).to.equal(template.messages.length);
    expect(foundTemplate.messages[0].template).to.be.ok;
    expect(foundTemplate.messages[0].template.content).to.equal(template.messages[0].template.content);
    expect(foundTemplate.messages[0]._templateId).to.be.ok;
    expect(foundTemplate.triggers.length).to.equal(template.triggers.length);
  });
});
