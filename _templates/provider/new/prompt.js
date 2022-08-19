module.exports = [
  {
    type: 'select',
    name: 'type',
    message: 'What type of provider is this?',
    choices: ['EMAIL', 'SMS', 'PUSH', 'CHAT'],
  },
  {
    type: 'input',
    name: 'name',
    message: 'Write the provider name camelCased:',
  },
];
