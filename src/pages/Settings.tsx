import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useStore } from '@/store'
import { downloadBackup, importState } from '@/lib/storage'
import { Download, Upload, Trash2, Save } from 'lucide-react'
import { useState } from 'react'

const AVATARS = ['🧙', '⚔️', '🏹', '🧝', '🦸', '🧛', '👩‍🚀', '🦹', '🧑‍🎤', '🥷', '🦾', '🧟', '🤖', '🦄', '🐉', '🐺']

export function SettingsPage() {
  const character = useStore((s) => s.character)
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const setName = useStore((s) => s.setName)
  const setAvatar = useStore((s) => s.setAvatar)
  const resetAll = useStore((s) => s.resetAll)
  const init = useStore((s) => s.init)

  const [localName, setLocalName] = useState(character.name)
  const [localKey, setLocalKey] = useState(settings.apiKey)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const json = ev.target?.result as string
      if (importState(json)) {
        init()
        alert('Imported successfully!')
      } else {
        alert('Invalid backup file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">Character</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium">Name</label>
            <div className="flex gap-2">
              <Input value={localName} onChange={(e) => setLocalName(e.target.value)} />
              <Button variant="outline" onClick={() => setName(localName)}><Save className="h-3.5 w-3.5" /> Save</Button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition ${character.avatar === a ? 'border-violet-500 bg-violet-500/10' : 'border-border/40 hover:border-violet-500/40'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">AI Coach</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium">Provider</label>
            <Select value={settings.aiProvider} onChange={(e) => updateSettings({ aiProvider: e.target.value as any })}>
              <option value="local">Offline (local replies, no API key needed)</option>
              <option value="gemini">Google Gemini (free tier)</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic Claude</option>
            </Select>
          </div>
          {settings.aiProvider !== 'local' && (
            <div>
              <label className="mb-1 block text-xs font-medium">API Key</label>
              <div className="flex gap-2">
                <Input type="password" value={localKey} onChange={(e) => setLocalKey(e.target.value)} placeholder="Paste your API key" />
                <Button variant="outline" onClick={() => updateSettings({ apiKey: localKey })}><Save className="h-3.5 w-3.5" /> Save</Button>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Stored only in your browser's localStorage. Never sent anywhere else.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Toggle label="Sound effects" checked={settings.sound} onChange={(v) => updateSettings({ sound: v })} />
          <Toggle label="Notifications" checked={settings.notifications} onChange={(v) => updateSettings({ notifications: v })} />
          <Toggle label="Compact mode" checked={settings.compactMode} onChange={(v) => updateSettings({ compactMode: v })} />
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">Data</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">All your data lives in this browser's localStorage. Export a backup regularly.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadBackup}>
              <Download className="h-3.5 w-3.5" /> Export backup
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-2 h-10 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium text-sm">
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              <Upload className="h-3.5 w-3.5" /> Import backup
            </label>
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              <Trash2 className="h-3.5 w-3.5" /> Reset everything
            </Button>
          </div>
          {confirmReset && (
            <div className="mt-3 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
              <p className="mb-2 text-sm text-red-200">Are you sure? This will delete all tasks, character progress, and settings.</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
                <Button size="sm" variant="danger" onClick={() => { resetAll(); setConfirmReset(false) }}>Yes, reset</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-xs text-muted-foreground">
          <p><strong className="text-foreground">Quest AI</strong> — the next-generation gamified habit tracker.</p>
          <p>All data stored locally. No tracking. No ads. Works offline.</p>
          <p>Keyboard shortcuts: <kbd className="rounded bg-muted px-1">Ctrl+K</kbd> for command palette.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/40 bg-background/30 p-3">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  )
}
