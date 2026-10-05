import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apexfuel.fitness',
  appName: 'Apex Fuel & Fitness',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
