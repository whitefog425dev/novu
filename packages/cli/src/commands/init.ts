import * as open from 'open';
import * as Configstore from 'configstore';
import axios from 'axios';
import { IOrganizationDTO } from '@notifire/shared';
import { prompt } from '../client';
import { promptIntroQuestions } from './init.consts';
import { HttpServer } from '../server';
import { SERVER_PORT, SERVER_HOST, REDIRECT_ROUTH, API_CREATE_ORGANIZATION_URL, API_OAUTH_URL } from '../constants';

export async function initCommand() {
  try {
    const answers = await prompt(promptIntroQuestions);

    const userJwt = await gitHubOAuth();

    const config = new Configstore('notu-cli');
    config.set('token', userJwt);

    const organizationId = getOrganizationId(userJwt);

    if (!organizationId) {
      await createOrganization(config, answers.applicationName);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.response.data);
  }
}

async function gitHubOAuth(): Promise<string> {
  const httpServer = new HttpServer();
  const redirectUrl = `http://${SERVER_HOST}:${SERVER_PORT}${REDIRECT_ROUTH}`;
  try {
    await httpServer.listen();

    await open(`${API_OAUTH_URL}?&redirectUrl=${redirectUrl}`);

    return await serverResponse(httpServer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  } finally {
    httpServer.close();
  }
}

function serverResponse(server: HttpServer): Promise<string> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (server.token) {
        clearInterval(interval);
        resolve(server.token);
      }
    }, 300);
  });
}

async function createOrganization(config: Configstore, organizationName: string): Promise<IOrganizationDTO> {
  return (
    await axios.post(
      API_CREATE_ORGANIZATION_URL,
      { name: organizationName },
      {
        headers: {
          authorization: `Bearer ${config.get('token')}`,
          host: `${SERVER_HOST}:${SERVER_PORT}`,
        },
      }
    )
  ).data.data;
}

function getOrganizationId(userJwt: string): string {
  const tokens = userJwt.split('.');
  const jsonToken = JSON.parse(Buffer.from(tokens[1], 'base64').toString());
  return jsonToken.organizationId;
}
