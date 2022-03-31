import { Injectable, Logger, Scope } from '@nestjs/common';
import { MemberEntity, OrganizationRepository, UserEntity, MemberRepository, UserRepository } from '@novu/dal';
import { MemberRoleEnum, MemberStatusEnum } from '@novu/shared';
import { Novu } from '@novu/node';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { AcceptInviteCommand } from './accept-invite.command';
import { AuthService } from '../../../auth/services/auth.service';
import { capitalize } from '../../../shared/services/helper/helper.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class AcceptInvite {
  private organizationId: string;

  constructor(
    private organizationRepository: OrganizationRepository,
    private memberRepository: MemberRepository,
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(command: AcceptInviteCommand): Promise<string> {
    const member = await this.memberRepository.findByInviteToken(command.token);
    if (!member) throw new ApiException('No organization found');
    const organization = await this.organizationRepository.findById(member._organizationId);
    const user = await this.userRepository.findById(command.userId);

    this.organizationId = organization._id;

    if (member.memberStatus !== MemberStatusEnum.INVITED) throw new ApiException('Token expired');

    const inviter = await this.userRepository.findById(member.invite._inviterId);

    await this.memberRepository.convertInvitedUserToMember(command.token, {
      memberStatus: MemberStatusEnum.ACTIVE,
      _userId: command.userId,
      answerDate: new Date(),
    });

    this.sendInviterAcceptedEmail(inviter, member);

    return this.authService.generateUserToken(user);
  }

  async sendInviterAcceptedEmail(inviter: UserEntity, member: MemberEntity) {
    try {
      if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'prod') {
        const novu = new Novu(process.env.NOVU_API_KEY as any);

        await novu.trigger('invite-accepted-dEQAsKD1E', {
          $user_id: inviter._id,
          $email: inviter.email,
          firstName: capitalize(inviter.firstName),
          invitedUserEmail: member.invite.email,
          ctaUrl: '/settings/organization',
        });
      }
    } catch (e) {
      Logger.error(e.message, e.stack, 'Accept inviter send email');
    }
  }
}
