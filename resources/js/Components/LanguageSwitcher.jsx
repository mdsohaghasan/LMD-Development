import React from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ar', label: 'العربية' },
];

export default function LanguageSwitcher() {
  const { locale } = usePage().props;

  const switchLanguage = (lang) => {
    Inertia.post('/language', { lang }, { preserveState: false });
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`px-2 py-1 rounded text-xs font-medium ${locale === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200'}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
