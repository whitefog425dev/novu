import { Injectable, Scope } from '@nestjs/common';
import { MemberRepository, OrganizationRepository } from '@notifire/dal';
import { MemberStatusEnum } from '@notifire/shared';
import { ApiException } from '../../../../shared/exceptions/api.exception';
import { AddMemberCommand } from './add-member.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class AddMember {
  private organizationId: string;

  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(command: AddMemberCommand): Promise<void> {
    this.organizationId = command.organizationId;

    const isAlreadyMember = await this.isMember(command.userId);
    if (isAlreadyMember) throw new ApiException('Member already exists');

    await this.memberRepository.addMember(command.organizationId, {
      _userId: command.userId,
      roles: command.roles,
      memberStatus: MemberStatusEnum.ACTIVE,
    });
  }

  private async isMember(userId: string): Promise<boolean> {
    return !!(await this.memberRepository.findMemberByUserId(this.organizationId, userId));
  }
}
