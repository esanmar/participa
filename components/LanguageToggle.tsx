
import React from 'react';
import Button from './Button';

interface LanguageToggleProps {
  currentLang: string;
  onToggle: (lang: string) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLang, onToggle }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={currentLang === 'es' ? 'primary' : 'outline'}
        onClick={() => onToggle('es')}
        className="text-sm px-4 py-2"
        aria-label="Cambiar a castellano"
        aria-pressed={currentLang === 'es'}
      >
        Español
      </Button>
      <Button
        variant={currentLang === 'eu' ? 'primary' : 'outline'}
        onClick={() => onToggle('eu')}
        className="text-sm px-4 py-2 font-sans"
        aria-label="Euskara aukeratu"
        aria-pressed={currentLang === 'eu'}
      >
        Euskara
      </Button>
    </div>
  );
};

export default LanguageToggle;
