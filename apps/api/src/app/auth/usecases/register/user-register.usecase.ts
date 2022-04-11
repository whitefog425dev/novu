import { Injectable } from '@nestjs/common';
import { MemberEntity, OrganizationEntity, UserRepository } from '@novu/dal';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../services/auth.service';
import { UserRegisterCommand } from './user-register.command';
import { normalizeEmail } from '../../../shared/helpers/email-normalization.service';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { CreateOrganization } from '../../../organization/usecases/create-organization/create-organization.usecase';
import { CreateOrganizationCommand } from '../../../organization/usecases/create-organization/create-organization.command';
import { AnalyticsService } from '../../../shared/services/analytics/analytics.service';
// eslint-disable-next-line max-len

@Injectable()
export class UserRegister {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
    private createOrganizationUsecase: CreateOrganization,
    private analyticsService: AnalyticsService
  ) {}

  async execute(command: UserRegisterCommand) {
    const email = normalizeEmail(command.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ApiException('User already exists');

    const passwordHash = await bcrypt.hash(command.password, 10);
    const user = await this.userRepository.create({
      email,
      firstName: command.firstName.toLowerCase(),
      lastName: command.lastName.toLowerCase(),
      password: passwordHash,
    });

    let organization: OrganizationEntity;
    if (command.organizationName) {
      organization = await this.createOrganizationUsecase.execute(
        CreateOrganizationCommand.create({
          name: command.organizationName,
          userId: user._id,
        })
      );

      this.analyticsService.upsertUser(
        {
          firstName: command.organizationName,
          lastName: '',
          email: user.email,
          _id: user._id,
          createdAt: user.createdAt,
        } as never,
        organization._id
      );
    }

    return {
      user: await this.userRepository.findById(user._id),
      token: await this.authService.generateUserToken(user),
    };
  }
}
