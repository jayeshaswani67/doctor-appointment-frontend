import { useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { saveSettings } from "../../api/settingsApi.ts";
import { toast } from "react-hot-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    workingDays: "Monday - Saturday",
    morningStart: "09:00",
    morningEnd: "13:00",
    eveningStart: "17:00",
    eveningEnd: "20:00",
    slotDuration: 15,
  });

  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);

      await saveSettings(settings);

      toast.success("Clinic settings saved successfully!");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to save settings"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500">
          Manage clinic settings.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow">
        <div className="mb-6 flex items-center gap-3">
          <SettingsIcon className="text-blue-600" />
          <h2 className="text-xl font-semibold">
            Clinic Settings
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">Working Days</label>
            <input
              value={settings.workingDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  workingDays: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Slot Duration</label>
            <select
              value={settings.slotDuration}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  slotDuration: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border p-3"
            >
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Morning Start</label>
            <input
              type="time"
              value={settings.morningStart}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  morningStart: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Morning End</label>
            <input
              type="time"
              value={settings.morningEnd}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  morningEnd: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Evening Start</label>
            <input
              type="time"
              value={settings.eveningStart}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  eveningStart: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Evening End</label>
            <input
              type="time"
              value={settings.eveningEnd}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  eveningEnd: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}