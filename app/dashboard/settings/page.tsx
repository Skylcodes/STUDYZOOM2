import { redirect } from 'next/navigation';
import { Routes } from '@/constants/routes';

/**
 * Default settings page that redirects to the profile settings
 * This maintains the original navigation structure where clicking on Settings
 * in the main sidebar takes you to the settings layout with the account sidebar
 */
export default function SettingsPage() {
  redirect(Routes.Profile);
}
