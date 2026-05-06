import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AppSettings, AppSettingKey } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Partial<AppSettings>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('key, value');

      if (fetchError) throw fetchError;

      const loadedSettings = data?.reduce((acc, curr) => {
        acc[curr.key as AppSettingKey] = curr.value;
        return acc;
      }, {} as Partial<AppSettings>);

      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = async (key: AppSettingKey): Promise<string> => {
    // If it's cached in memory, return it
    if (settings[key] !== undefined) {
      return settings[key] as string;
    }
    
    // Fallback to fetch directly if not in memory (though should be rare)
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();
        
      if (error) throw error;
      return data.value;
    } catch (err) {
      console.error(`Error getting setting ${key}:`, err);
      return '';
    }
  };

  const updateSetting = async (key: AppSettingKey, value: string): Promise<void> => {
    try {
      setError(null);
      const { error: upsertError } = await supabase
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (upsertError) throw upsertError;

      // Update local cache
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<Record<AppSettingKey, string>>): Promise<void> => {
    try {
      setError(null);
      
      const rowsToUpsert = Object.entries(updates).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error: upsertError } = await supabase
        .from('app_settings')
        .upsert(rowsToUpsert);

      if (upsertError) throw upsertError;

      // Update local cache
      setSettings(prev => ({ ...prev, ...updates }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    getSetting,
    updateSetting,
    updateSettings,
    refreshSettings: fetchSettings
  };
}
