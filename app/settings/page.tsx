"use client"

import { Settings } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApiaryProfile from "@/components/apiary-profile"
import NotificationSettings from "@/components/notification-settings"
import DataManagement from "@/components/data-management"
import PreferencesSettings from "@/components/preferences-settings"
import HelpSupport from "@/components/help-support"
import { useTranslation } from "@/lib/translation-context"

export default function SettingsPage() {
  const { t } = useTranslation()
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
              <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">{t('settings.title')}</h1>
          </div>
          <p className="text-amber-700/70 dark:text-amber-300/70 ml-12 sm:ml-14 text-sm sm:text-base">Manage your profile, notifications, data, and preferences</p>
        </div>

        <Tabs defaultValue="apiary" className="w-full">
          <TabsList className="flex w-full overflow-x-auto mb-6 bg-amber-100/50 dark:bg-amber-900/30 p-1 rounded-xl gap-1">
            <TabsTrigger value="apiary" className="flex-shrink-0 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">{t('settings.apiary')}</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-shrink-0 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">{t('settings.alerts')}</TabsTrigger>
            <TabsTrigger value="data" className="flex-shrink-0 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">{t('settings.data')}</TabsTrigger>
            <TabsTrigger value="preferences" className="flex-shrink-0 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">{t('settings.preferences')}</TabsTrigger>
            <TabsTrigger value="help" className="flex-shrink-0 px-4 py-2 data-[state=active]:bg-[#FFA95C] data-[state=active]:text-white rounded-lg font-semibold text-xs sm:text-sm text-amber-800 dark:text-amber-200">{t('settings.help')}</TabsTrigger>
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

      <Footer />
    </div>
  )
}
