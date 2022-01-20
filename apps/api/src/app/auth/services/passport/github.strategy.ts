import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as githubPassport from 'passport-github2';
import { Metadata, StateStoreStoreCallback, StateStoreVerifyCallback } from 'passport-oauth2';
import { AuthProviderEnum } from '@notifire/shared';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(githubPassport.Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_OAUTH_REDIRECT,
      scope: ['user:email'],
      passReqToCallback: true,
      store: {
        verify(req, state: string, meta: Metadata, callback: StateStoreVerifyCallback) {
          callback(null, true, req.query.distinctId);
        },
        store(req, meta: Metadata, callback: StateStoreStoreCallback) {
          callback(null, req.query.distinctId);
        },
      },
    });
  }

  async validate(req, accessToken: string, refreshToken: string, profile, done: (err, data) => void) {
    try {
      const updatedProfile = { ...profile._json, email: profile.emails[0].value };
      const response = await this.authService.authenticate(
        AuthProviderEnum.GITHUB,
        accessToken,
        refreshToken,
        updatedProfile,
        req.query.state
      );

      done(null, {
        token: response.token,
        newUser: response.newUser,
      });
    } catch (err) {
      done(err, false);
    }
  }
}
