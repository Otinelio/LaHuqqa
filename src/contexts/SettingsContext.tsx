import { createContext, useContext, useState, useEffect } from "react";
import { getSettings, type RestaurantSettings } from "@/services/restaurantService";

const defaultSettings: RestaurantSettings = {
  id: "",
  name: "La HuQQa",
  tagline: "Une expérience au goût unique.",
  whatsapp: "22896949494",
  address: "Bd. de la Kara, Tokoin Wuiti, Lomé, Togo",
  hours: "Lundi–Dimanche · 11h30 – 00h00",
  email: "lahuqqatogo@gmail.com",
  instagram: "instagram.com/la.huqqa",
  facebook: "facebook.com/LahuQQa",
  updated_at: "",
};

const SettingsContext = createContext<RestaurantSettings>(defaultSettings);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    }).catch(console.error);
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
