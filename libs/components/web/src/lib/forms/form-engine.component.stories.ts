/**
 ************************************************************************
 * Copyright (C) 2026 Clarivex Technologies Private Limited
 * All Rights Reserved.
 *
 * NOTICE: All intellectual and technical concepts contained
 * herein are proprietary to Clarivex Technologies Private Limited
 * and may be covered by Indian and Foreign Patents,
 * patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written
 * permission is obtained from Clarivex Technologies Private Limited.
 *
 * Product:   Pervaxis Platform
 * Website:   https://clarivex.tech
 ************************************************************************
 */

import type { Meta, StoryObj } from '@storybook/angular';
import { FormEngineComponent } from './form-engine.component';
import type { FormSchema } from './form-types';

const loginSchema: FormSchema = {
  fields: [
    {
      key: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'you@example.com',
      validation: { required: true },
    },
    {
      key: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '••••••••',
      validation: { required: true, minLength: 8 },
    },
  ],
};

const profileSchema: FormSchema = {
  fields: [
    {
      key: 'firstName',
      type: 'text',
      label: 'First name',
      placeholder: 'Alice',
      validation: { required: true },
    },
    {
      key: 'lastName',
      type: 'text',
      label: 'Last name',
      placeholder: 'Johnson',
      validation: { required: true },
    },
    {
      key: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself…',
      rows: 4,
    },
    {
      key: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { label: 'Engineer', value: 'engineer' },
        { label: 'Designer', value: 'designer' },
        { label: 'Manager', value: 'manager' },
      ],
      validation: { required: true },
    },
  ],
};

const meta: Meta<FormEngineComponent> = {
  title: 'Components/FormEngine',
  component: FormEngineComponent,
  tags: ['autodocs'],
  argTypes: {
    submitLabel: { control: 'text' },
    suppressDefaultSubmit: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FormEngineComponent>;

export const Login: Story = {
  args: {
    schema: loginSchema,
    submitLabel: 'Sign In',
  },
};

export const EditProfile: Story = {
  args: {
    schema: profileSchema,
    submitLabel: 'Save Changes',
  },
};
