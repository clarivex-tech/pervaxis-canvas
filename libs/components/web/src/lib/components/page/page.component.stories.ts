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
import { PageComponent } from './page.component';

const meta: Meta<PageComponent> = {
  title: 'Components/Page',
  component: PageComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Page heading text' },
    subtitle: { control: 'text', description: 'Optional subheading below the title' },
  },
};

export default meta;
type Story = StoryObj<PageComponent>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Dashboard',
    subtitle: 'Welcome back! Here is what is happening today.',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Pervaxis Platform Configuration & Settings',
    subtitle: 'Manage your workspace preferences, integrations, and security policies.',
  },
};
