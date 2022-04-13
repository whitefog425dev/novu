import { expect } from 'chai';
import { UserSession } from '@novu/testing';
import { ChannelCTATypeEnum, ChannelTypeEnum, INotificationTemplate, TriggerTypeEnum } from '@novu/shared';
import * as moment from 'moment';
import { CreateNotificationTemplateDto } from '../dto/create-notification-template.dto';
import { ChangeRepository } from '@novu/dal';

describe('Create Notification template - /notification-templates (POST)', async () => {
  let session: UserSession;
  const changeRepository: ChangeRepository = new ChangeRepository();

  before(async () => {
    session = new UserSession();
    await session.initialize();
  });

  it('should create email template', async function () {
    const testTemplate: Partial<CreateNotificationTemplateDto> = {
      name: 'test email template',
      description: 'This is a test description',
      tags: ['test-tag'],
      notificationGroupId: session.notificationGroups[0]._id,
      steps: [
        {
          name: 'Message Name',
          subject: 'Test email subject',
          type: ChannelTypeEnum.EMAIL,
          filters: [
            {
              isNegated: false,
              type: 'GROUP',
              value: 'AND',
              children: [
                {
                  field: 'firstName',
                  value: 'test value',
                  operator: 'EQUAL',
                },
              ],
            },
          ],
          content: [
            {
              type: 'text',
              content: 'This is a sample text block',
            },
          ],
        },
      ],
    };

    const { body } = await session.testAgent.post(`/v1/notification-templates`).send(testTemplate);

    expect(body.data).to.be.ok;
    const template: INotificationTemplate = body.data;

    expect(template._notificationGroupId).to.equal(testTemplate.notificationGroupId);
    const message = template.steps[0];

    expect(message.template.name).to.equal(`${testTemplate.steps[0].name}`);
    expect(message.template.subject).to.equal(`${testTemplate.steps[0].subject}`);
    expect(message.filters[0].type).to.equal(testTemplate.steps[0].filters[0].type);
    expect(message.filters[0].children.length).to.equal(testTemplate.steps[0].filters[0].children.length);

    expect(message.filters[0].children[0].value).to.equal(testTemplate.steps[0].filters[0].children[0].value);

    expect(message.filters[0].children[0].operator).to.equal(testTemplate.steps[0].filters[0].children[0].operator);

    expect(message.template.type).to.equal(ChannelTypeEnum.EMAIL);
    expect(template.tags[0]).to.equal('test-tag');
    if (Array.isArray(message.template.content) && Array.isArray(testTemplate.steps[0].content)) {
      expect(message.template.content[0].type).to.equal(testTemplate.steps[0].content[0].type);
    } else {
      throw new Error('content must be an array');
    }

    const change = await changeRepository.findOne({
      _entityId: template._id,
    });
    expect(change._entityId).to.eq(template._id);
  });

  it('should create a valid notification', async () => {
    const testTemplate: Partial<CreateNotificationTemplateDto> = {
      name: 'test template',
      description: 'This is a test description',
      notificationGroupId: session.notificationGroups[0]._id,
      steps: [
        {
          type: ChannelTypeEnum.IN_APP,
          content: 'Test Template',
          cta: {
            type: ChannelCTATypeEnum.REDIRECT,
            data: {
              url: 'https://example.org/profile',
            },
          },
        },
      ],
    };
    const { body } = await session.testAgent.post(`/v1/notification-templates`).send(testTemplate);

    expect(body.data).to.be.ok;

    const template: INotificationTemplate = body.data;

    expect(template._id).to.be.ok;
    expect(template.description).to.equal(testTemplate.description);
    expect(template.name).to.equal(testTemplate.name);
    expect(template.draft).to.equal(true);
    expect(template.active).to.equal(false);
    expect(moment(template.createdAt).isSame(moment(), 'day'));

    expect(template.steps.length).to.equal(1);
    expect(template.steps[0].template.type).to.equal(ChannelTypeEnum.IN_APP);
    expect(template.steps[0].template.content).to.equal(testTemplate.steps[0].content);
    expect(template.steps[0].template.cta.data.url).to.equal(testTemplate.steps[0].cta.data.url);
  });

  it('should create event trigger', async () => {
    const testTemplate: Partial<CreateNotificationTemplateDto> = {
      name: 'test template',
      notificationGroupId: session.notificationGroups[0]._id,
      description: 'This is a test description',
      steps: [
        {
          type: ChannelTypeEnum.IN_APP,
          content: 'Test Template {{name}} {{lastName}}',
          cta: {
            type: ChannelCTATypeEnum.REDIRECT,
            data: {
              url: 'https://example.org/profile',
            },
          },
        },
      ],
    };

    const { body } = await session.testAgent.post(`/v1/notification-templates`).send(testTemplate);

    expect(body.data).to.be.ok;

    const template: INotificationTemplate = body.data;

    expect(template.triggers.length).to.equal(1);
    expect(template.triggers[0].identifier).to.include('test');
    expect(template.triggers[0].type).to.equal(TriggerTypeEnum.EVENT);
  });

  it('should only add shortid to trigger identifier if same identifier exists', async () => {
    const testTemplate: Partial<CreateNotificationTemplateDto> = {
      name: 'test',
      notificationGroupId: session.notificationGroups[0]._id,
      description: 'This is a test description',
      steps: [],
    };

    const { body } = await session.testAgent.post(`/v1/notification-templates`).send(testTemplate);

    expect(body.data).to.be.ok;
    const template: INotificationTemplate = body.data;

    expect(template.triggers[0].identifier).to.equal('test');

    const sameNameTemplate: Partial<CreateNotificationTemplateDto> = {
      name: 'test',
      notificationGroupId: session.notificationGroups[0]._id,
      description: 'This is a test description',
      steps: [],
    };
    const { body: newBody } = await session.testAgent.post(`/v1/notification-templates`).send(sameNameTemplate);

    expect(newBody.data).to.be.ok;
    const newTemplate: INotificationTemplate = newBody.data;

    expect(newTemplate.triggers[0].identifier).to.include('test-');
  });
});
