
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.64811beebbc84da6b36ee5732ab005af',
  appName: 'verify-then-dashboard-access',
  webDir: 'dist',
  server: {
    url: 'https://64811bee-bbc8-4da6-b36e-e5732ab005af.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
