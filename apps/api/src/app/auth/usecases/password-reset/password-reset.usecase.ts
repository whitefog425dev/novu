import { Injectable } from '@nestjs/common';
import { UserRepository } from '@novu/dal';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { PasswordResetCommand } from './password-reset.command';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class PasswordReset {
  constructor(private userRepository: UserRepository, private authService: AuthService) {}

  async execute(command: PasswordResetCommand): Promise<{ token: string }> {
    const user = await this.userRepository.findUserByToken(command.token);
    if (!user) {
      throw new ApiException('Bad token provided');
    }

    if (moment(user.resetTokenDate).isBefore(moment().subtract(7, 'days'))) {
      throw new ApiException('Token has expired');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    await this.userRepository.update(
      {
        _id: user._id,
      },
      {
        $set: {
          password: passwordHash,
        },
        $unset: {
          resetToken: 1,
          resetTokenDate: 1,
        },
      }
    );

    return {
      token: await this.authService.generateUserToken(user),
    };
  }
}
