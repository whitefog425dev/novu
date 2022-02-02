import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Title } from './Title';

export default {
  title: 'Components/Typography/Title',
  component: Title,
  argTypes: {},
} as ComponentMeta<typeof Title>;

const Template: ComponentStory<typeof Title> = ({ ...args }) => <Title {...args}>Example Text</Title>;

export const all = () => (
  <div>
    <Title>Header 1</Title>
    <Title size={1}>Header 2</Title>
  </div>
);

export const Header1 = Template.bind({});
Header1.args = {
  size: 1,
};

export const Header2 = Template.bind({});
Header2.args = {
  size: 2,
};
