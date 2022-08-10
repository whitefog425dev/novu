import { Injectable, Scope } from '@nestjs/common';
import { OrganizationRepository, UserRepository, MemberRepository } from '@novu/dal';
import { MemberStatusEnum } from '@novu/shared';
import { Novu } from '@novu/node';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { ResendInviteCommand } from './resend-invite.command';
import { capitalize, createGuid } from '../../../shared/services/helper/helper.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class ResendInvite {
  constructor(
    private organizationRepository: OrganizationRepository,
    private userRepository: UserRepository,
    private memberRepository: MemberRepository
  ) {}

  async execute(command: ResendInviteCommand) {
    const organization = await this.organizationRepository.findById(command.organizationId);
    if (!organization) throw new ApiException('No organization found');

    const foundInvitee = await this.memberRepository.findById(command.memberId);
    if (!foundInvitee) throw new ApiException('Member not found');
    if (foundInvitee.memberStatus !== MemberStatusEnum.INVITED) throw new ApiException('Member already active');

    const inviterUser = await this.userRepository.findById(command.userId);

    const token = createGuid();

    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'prod') {
      const novu = new Novu(process.env.NOVU_API_KEY);

      await novu.trigger(process.env.NOVU_TEMPLATEID_INVITE_TO_ORGANISATION || 'invite-to-organization-wBnO8NpDn', {
        to: {
          subscriberId: foundInvitee.invite.email,
          email: foundInvitee.invite.email,
        },
        payload: {
          email: foundInvitee.invite.email,
          inviteeName: capitalize(foundInvitee.invite.email.split('@')[0]),
          organizationName: capitalize(organization.name),
          inviterName: capitalize(inviterUser.firstName),
          acceptInviteUrl: `${process.env.FRONT_BASE_URL}/auth/invitation/${token}`,
        },
      });
    }

    await this.memberRepository.update(foundInvitee, {
      memberStatus: MemberStatusEnum.INVITED,
      invite: {
        token,
        _inviterId: command.userId,
        invitationDate: new Date(),
      },
    });
  }
}
