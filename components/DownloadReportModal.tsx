import React, { useState, useEffect } from 'react';
import Button from './Button';
import { XMarkIcon, CheckIcon } from '../constants';
import { useLocalization } from '../hooks/useLocalization';

export interface ReportOptions {
    sections: string[];
    format: 'pdf' | 'csv';
}

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (options: ReportOptions) => void;
}

const reportSections = [
    { id: 'riskMetrics', labelKey: 'reportSectionRiskMetrics' },
    { id: 'criticalAreas', labelKey: 'reportSectionCriticalAreas' },
    { id: 'heatmap', labelKey: 'reportSectionHeatmap' },
    { id: 'distribution', labelKey: 'reportSectionDistribution' },
    { id: 'recommendations', labelKey: 'reportSectionRecommendations' }
];

const DownloadReportModal: React.FC<DownloadReportModalProps> = ({ isOpen, onClose, onDownload }) => {
  const { t } = useLocalization();
  const [selectedSections, setSelectedSections] = useState<string[]>(reportSections.map(s => s.id));
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

  useEffect(() => {
    if (isOpen) {
      setSelectedSections(reportSections.map(s => s.id));
      setFormat('pdf');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSectionToggle = (id: string) => {
    setSelectedSections(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleDownloadClick = () => {
    onDownload({ sections: selectedSections, format });
  };
  
  const isDownloadDisabled = format === 'csv' && !selectedSections.includes('criticalAreas');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] flex flex-col animated-section"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-neutral-gray">
          <h2 className="text-xl font-bold text-neutral-dark-gray">{t('downloadReportTitle')}</h2>
          <button onClick={onClose} aria-label={t('settingsCloseAria')} className="p-1 rounded-full hover:bg-neutral-gray">
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="font-semibold text-neutral-dark-gray mb-2">{t('downloadSectionsLabel')}</h3>
                <div className="space-y-2">
                    {reportSections.map(section => (
                        <label key={section.id} className="flex items-center p-2 bg-neutral-light-gray rounded-md cursor-pointer hover:bg-neutral-gray">
                            <input
                                type="checkbox"
                                checked={selectedSections.includes(section.id)}
                                onChange={() => handleSectionToggle(section.id)}
                                className="h-5 w-5 rounded text-gov-blue-500 focus:ring-gov-blue-500 border-gray-300"
                            />
                            <span className="ml-3 text-neutral-dark-gray">{t(section.labelKey)}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold text-neutral-dark-gray mb-2">{t('downloadFormatLabel')}</h3>
                <div className="flex gap-4">
                    <label className={`flex items-center p-3 rounded-md cursor-pointer border-2 w-full ${format === 'pdf' ? 'border-gov-blue-500 bg-gov-blue-500/10' : 'border-neutral-gray'}`}>
                        <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={() => setFormat('pdf')} className="h-4 w-4 text-gov-blue-500 focus:ring-gov-blue-500"/>
                        <span className="ml-2">{t('pdfDocument')}</span>
                    </label>
                     <label className={`flex items-center p-3 rounded-md cursor-pointer border-2 w-full ${format === 'csv' ? 'border-gov-blue-500 bg-gov-blue-500/10' : 'border-neutral-gray'}`}>
                        <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} className="h-4 w-4 text-gov-blue-500 focus:ring-gov-blue-500"/>
                        <span className="ml-2">{t('csvData')}</span>
                    </label>
                </div>
                {format === 'csv' && <p className="text-xs text-gray-500 mt-2">{t('csvOnlyCriticalAreas')}</p>}
            </div>
        </div>

        <footer className="p-4 bg-neutral-light-gray/50 border-t border-neutral-gray flex justify-end">
            <div className="flex items-center gap-4">
                 {isDownloadDisabled && <p className="text-xs text-red-500">{t('csvSelectCriticalAreas')}</p>}
                <Button variant="ghost" onClick={onClose}>{t('cancel')}</Button>
                <Button variant="primary" onClick={handleDownloadClick} disabled={isDownloadDisabled}>
                    {t('download')}
                </Button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default DownloadReportModal;
