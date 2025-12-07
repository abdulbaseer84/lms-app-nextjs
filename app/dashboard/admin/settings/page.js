"use client";

import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    logo: "",
  });

  const [loading, setLoading] = useState(false);

  // Load existing settings
  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await res.json();

      if (data.settings) {
        setSettings(data.settings);
      }
    }
    loadSettings();
  }, []);

  // Upload logo to server
  async function uploadLogo(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setSettings((prev) => ({ ...prev, logo: data.url }));
    }
  }

  // Save settings to DB
  async function handleSave() {
    setLoading(true);

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    });

    setLoading(false);

    if (res.ok) {
      alert("Settings saved!");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white shadow p-6 rounded w-full max-w-2xl">
        
        {/* Site Name */}
        <label className="block font-semibold mb-1">Site Name</label>
        <input
          className="border p-2 rounded w-full mb-4"
          value={settings.siteName}
          onChange={(e) =>
            setSettings({ ...settings, siteName: e.target.value })
          }
        />

        {/* Site Description */}
        <label className="block font-semibold mb-1">Site Description</label>
        <textarea
          className="border p-2 rounded w-full mb-4 h-24"
          value={settings.siteDescription}
          onChange={(e) =>
            setSettings({ ...settings, siteDescription: e.target.value })
          }
        />

        {/* Logo Upload */}
        <label className="block font-semibold mb-1">Site Logo</label>

        <input
          type="file"
          accept="image/*"
          className="mb-3"
          onChange={(e) => uploadLogo(e.target.files[0])}
        />

        {/* Preview Logo */}
        {settings.logo && (
          <img
            src={settings.logo}
            alt="Logo Preview"
            className="w-24 h-24 object-cover border rounded mb-4"
          />
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
