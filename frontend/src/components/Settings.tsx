import { UserRole } from '../App';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { ChevronRight, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

interface SettingsProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Settings({ userRole, onRoleChange }: SettingsProps) {
  return (
    <div className="p-4">
      <h1 className="text-white mb-6">Settings</h1>

      {/* Demo: Role Switcher */}
      <Card className="bg-[#429ebd]/20 border-[#429ebd]/30 p-4 mb-6">
        <h3 className="text-[#9fe7f5] mb-3">Demo Mode</h3>
        <p className="text-sm text-[#9fe7f5] mb-3">Switch between member and captain views</p>
        <div className="flex gap-2">
          <Button
            onClick={() => onRoleChange('member')}
            variant={userRole === 'member' ? 'default' : 'outline'}
            className={userRole === 'member' ? 'bg-[#429ebd] hover:bg-[#3a8ba8] text-white' : 'border-[#429ebd] text-[#429ebd]'}
          >
            Member View
          </Button>
          <Button
            onClick={() => onRoleChange('captain')}
            variant={userRole === 'captain' ? 'default' : 'outline'}
            className={userRole === 'captain' ? 'bg-[#429ebd] hover:bg-[#3a8ba8] text-white' : 'border-[#429ebd] text-[#429ebd]'}
          >
            Captain View
          </Button>
        </div>
      </Card>

      {/* Profile */}
      <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
        <button className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#429ebd]" />
            <div className="text-left">
              <p className="text-white">Profile</p>
              <p className="text-sm text-[#94a3b8]">Manage your account</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#64748b]" />
        </button>
      </Card>

      {/* Notifications */}
      <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
        <h3 className="text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#429ebd]" />
              <div>
                <p className="text-white text-sm">Push Notifications</p>
                <p className="text-xs text-[#94a3b8]">Get notified about updates</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">Conflict Alerts</p>
              <p className="text-xs text-[#94a3b8]">Alert when conflicts detected</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">AI Suggestions</p>
              <p className="text-xs text-[#94a3b8]">Get AI-powered recommendations</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
        <button className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#429ebd]" />
            <div className="text-left">
              <p className="text-white">Privacy & Security</p>
              <p className="text-sm text-[#94a3b8]">Manage your data</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#64748b]" />
        </button>
      </Card>

      {/* Help & Support */}
      <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
        <button className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#429ebd]" />
            <div className="text-left">
              <p className="text-white">Help & Support</p>
              <p className="text-sm text-[#94a3b8]">Get help with Gather</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#64748b]" />
        </button>
      </Card>

      {/* Log Out */}
      <Button
        variant="outline"
        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Log Out
      </Button>

      <div className="mt-8 text-center text-sm text-[#64748b]">
        <p>Gather v1.0.0</p>
        <p className="mt-1">© 2025 Gather App</p>
      </div>
    </div>
  );
}
