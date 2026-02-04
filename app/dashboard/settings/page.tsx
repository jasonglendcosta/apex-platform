import { Header } from '@/components/layout/Header'
import { Building2, Users, CreditCard, Bell, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Settings" 
        description="Manage your account and platform settings"
      />
      
      <div className="p-8">
        <div className="max-w-4xl">
          <div className="space-y-6">
            {/* Organization Settings */}
            <SettingsSection
              icon={<Building2 className="w-5 h-5" />}
              title="Organization"
              description="Manage your company profile and branding"
            >
              <div className="grid gap-4">
                <SettingsField label="Company Name" value="One Development" />
                <SettingsField label="Website" value="https://onedevelopment.ae" />
                <SettingsField label="Primary Color" value="#D86DCB" type="color" />
              </div>
            </SettingsSection>

            {/* Team Settings */}
            <SettingsSection
              icon={<Users className="w-5 h-5" />}
              title="Team Members"
              description="Manage users and permissions"
            >
              <div className="space-y-3">
                <TeamMember name="Jason D Costa" email="j.dcosta@oneuae.com" role="Admin" />
                <TeamMember name="Ahmed Al-Rashid" email="ahmed@onedevelopment.ae" role="Agent" />
                <TeamMember name="Sarah Johnson" email="sarah@onedevelopment.ae" role="Agent" />
              </div>
              <button className="btn-secondary mt-4">Invite Team Member</button>
            </SettingsSection>

            {/* Notification Settings */}
            <SettingsSection
              icon={<Bell className="w-5 h-5" />}
              title="Notifications"
              description="Configure alerts and notifications"
            >
              <div className="space-y-4">
                <ToggleSetting label="Email notifications" description="Receive email for important updates" enabled />
                <ToggleSetting label="Reservation expiry alerts" description="Alert 4 hours before expiry" enabled />
                <ToggleSetting label="New lead notifications" description="Notify when new leads arrive" enabled />
                <ToggleSetting label="Payment reminders" description="Remind customers of upcoming payments" enabled={false} />
              </div>
            </SettingsSection>

            {/* Security Settings */}
            <SettingsSection
              icon={<Shield className="w-5 h-5" />}
              title="Security"
              description="Manage authentication and security"
            >
              <div className="space-y-4">
                <ToggleSetting label="Two-factor authentication" description="Add an extra layer of security" enabled={false} />
                <ToggleSetting label="Session timeout" description="Auto-logout after 30 minutes of inactivity" enabled />
              </div>
            </SettingsSection>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ 
  icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 bg-apex-pink/10 rounded-lg text-apex-pink">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function SettingsField({ 
  label, 
  value, 
  type = 'text' 
}: { 
  label: string
  value: string
  type?: 'text' | 'color'
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-400">{label}</span>
      {type === 'color' ? (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: value }} />
          <span className="text-white font-mono">{value}</span>
        </div>
      ) : (
        <span className="text-white">{value}</span>
      )}
    </div>
  )
}

function TeamMember({ 
  name, 
  email, 
  role 
}: { 
  name: string
  email: string
  role: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-apex-darker rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-apex-pink/20 rounded-full flex items-center justify-center">
          <span className="text-apex-pink font-medium">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-white font-medium">{name}</p>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>
      </div>
      <span className="px-3 py-1 bg-apex-card rounded text-sm text-gray-400">{role}</span>
    </div>
  )
}

function ToggleSetting({ 
  label, 
  description, 
  enabled 
}: { 
  label: string
  description: string
  enabled: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white">{label}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <button className={`
        w-12 h-6 rounded-full transition-colors relative
        ${enabled ? 'bg-apex-pink' : 'bg-apex-card border border-apex-border'}
      `}>
        <span className={`
          absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
          ${enabled ? 'left-7' : 'left-1'}
        `} />
      </button>
    </div>
  )
}
