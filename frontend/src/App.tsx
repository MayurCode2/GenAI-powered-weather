import { useCallback, useEffect, useState } from 'react';
import { LanguageToggle } from './components/LanguageToggle';
import { Nav } from './components/Nav';
import { t } from './i18n';
import { ApiError, fetchAqi, fetchPlan } from './lib/api';
import {
  joinGroup,
  leaveGroup,
  loadCommunity,
  type CommunityState,
} from './lib/community';
import {
  loadLanguage,
  loadPlan,
  loadProfile,
  loadToggles,
  saveLanguage,
  savePlan,
  saveProfile,
  saveToggles,
} from './lib/storage';
import { Community } from './screens/Community';
import { Home } from './screens/Home';
import { Impact } from './screens/Impact';
import { Plan } from './screens/Plan';
import { Profile } from './screens/Profile';
import type {
  AqiData,
  ImpactToggles,
  Language,
  PlanData,
  Profile as ProfileType,
  Screen,
} from './types';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadLanguage());
  const [screen, setScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<ProfileType>(() => loadProfile());
  const [toggles, setToggles] = useState<ImpactToggles>(() => loadToggles());
  const [community, setCommunity] = useState<CommunityState>(() =>
    loadCommunity(),
  );
  const [plan, setPlan] = useState<PlanData | null>(() => loadPlan());
  const [planFromCache, setPlanFromCache] = useState(() => Boolean(loadPlan()));

  const [aqi, setAqi] = useState<AqiData | null>(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [aqiError, setAqiError] = useState<string | null>(null);

  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const dict = t(lang);

  const loadAqi = useCallback(
    async (p: ProfileType) => {
      setAqiLoading(true);
      setAqiError(null);
      try {
        const data = await fetchAqi(p.locationLabel || p.city, {
          lat: p.lat,
          lon: p.lon,
        });
        setAqi(data);
        // If GPS resolved a nicer place name, update label once (no loop: only when GPS set)
        if (
          p.lat != null &&
          p.lon != null &&
          data.city &&
          data.city !== p.locationLabel &&
          data.city !== p.city
        ) {
          const synced = {
            ...p,
            city: data.city,
            locationLabel: data.city,
            lat: data.lat ?? p.lat,
            lon: data.lon ?? p.lon,
          };
          setProfile(synced);
          saveProfile(synced);
        }
      } catch (e) {
        setAqi(null);
        setAqiError(
          e instanceof ApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'Failed to load AQI',
        );
      } finally {
        setAqiLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadAqi(profile);
    // Re-fetch when city or GPS coords change
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: lat/lon/city only
  }, [profile.city, profile.lat, profile.lon, loadAqi]);

  const handleLang = (next: Language) => {
    setLang(next);
    saveLanguage(next);
  };

  const handleSaveProfile = (next: ProfileType) => {
    setProfile(next);
    saveProfile(next);
  };

  const handleCityChange = (city: string) => {
    const next: ProfileType = {
      ...profile,
      city,
      locationLabel: city,
      lat: null,
      lon: null,
    };
    setProfile(next);
    saveProfile(next);
  };

  const handleToggles = (next: ImpactToggles) => {
    setToggles(next);
    saveToggles(next);
  };

  const handleGeneratePlan = async () => {
    if (!aqi) {
      setPlanError('AQI not loaded yet — retry AQI first.');
      return;
    }
    setPlanLoading(true);
    setPlanError(null);
    try {
      const data = await fetchPlan(profile, aqi, lang);
      setPlan(data);
      savePlan(data);
      setPlanFromCache(false);
      setScreen('plan');
    } catch (e) {
      setPlanError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : dict.common.error,
      );
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pb-28 pt-5">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {screen !== 'home' && (
            <>
              <p className="font-display text-2xl text-[var(--mist-ink)]">
                {dict.brand}
              </p>
              <p className="truncate text-xs text-[var(--mist-deep)]">
                {dict.tagline}
              </p>
            </>
          )}
        </div>
        <LanguageToggle lang={lang} dict={dict} onChange={handleLang} />
      </header>

      <main>
        {screen === 'home' && (
          <Home
            dict={dict}
            aqi={aqi}
            aqiLoading={aqiLoading}
            aqiError={aqiError}
            onRetryAqi={() => void loadAqi(profile)}
            plan={plan}
            planLoading={planLoading}
            planError={planError}
            onGeneratePlan={() => void handleGeneratePlan()}
            onOpenPlan={() => setScreen('plan')}
            profileCity={profile.locationLabel || profile.city}
            cityValue={profile.city}
            onCityChange={handleCityChange}
          />
        )}
        {screen === 'plan' && (
          <Plan
            dict={dict}
            plan={plan}
            fromCache={planFromCache}
            loading={planLoading}
            error={planError}
            onGenerate={() => void handleGeneratePlan()}
          />
        )}
        {screen === 'impact' && (
          <Impact
            dict={dict}
            toggles={toggles}
            profile={profile}
            onChange={handleToggles}
          />
        )}
        {screen === 'community' && (
          <Community
            dict={dict}
            community={community}
            toggles={toggles}
            profile={profile}
            onJoin={(name) => setCommunity(joinGroup(name))}
            onLeave={() => setCommunity(leaveGroup())}
          />
        )}
        {screen === 'profile' && (
          <Profile
            dict={dict}
            profile={profile}
            onSave={handleSaveProfile}
          />
        )}
      </main>

      <Nav screen={screen} dict={dict} onNavigate={setScreen} />
    </div>
  );
}
