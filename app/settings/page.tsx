"use client"

import Navigation from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApiaryProfile from "@/components/apiary-profile"
import NotificationSettings from "@/components/notification-settings"
import DataManagement from "@/components/data-management"
import PreferencesSettings from "@/components/preferences-settings"
import HelpSupport from "@/components/help-support"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-muted">Manage your profile, notifications, data, and preferences</p>
        </div>

        <Tabs defaultValue="apiary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="apiary">Apiary</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="apiary">
            <ApiaryProfile />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesSettings />
          </TabsContent>

          <TabsContent value="help">
            <HelpSupport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
