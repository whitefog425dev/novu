import { providers } from '@notifire/shared';
import { ListQuestionOptions } from 'inquirer';
import * as chalk from 'chalk';

export const promptIntroQuestions: ListQuestionOptions[] = [
  {
    name: 'applicationName',
    message: 'What is your application name?',
    default: 'Acme App.',
  },
  {
    type: 'checkbox',
    name: 'providers',
    message: 'What delivery providers you are using? (Optional)',
    choices: providers.map((provider) => `${provider.displayName} ${chalk.dim(`(${provider.type})`)}`),
  },
];
