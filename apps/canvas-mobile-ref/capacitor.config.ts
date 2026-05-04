import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor configuration for canvas-mobile-ref.
 * Update `appId` and `appName` when creating a production print from this template.
 */
const config: CapacitorConfig = {
  appId: 'tech.clarivex.canvas.mobileref',
  appName: 'Canvas Mobile Ref',
  webDir: '../../dist/apps/canvas-mobile-ref/browser',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
