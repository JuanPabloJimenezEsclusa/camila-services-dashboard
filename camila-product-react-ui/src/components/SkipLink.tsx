/**
 * Skip to Main Content Link
 * Accessibility feature for keyboard navigation
 * Allows users to bypass header/navigation and jump to main content
 */

import { useTranslation } from 'react-i18next';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a href="#main-content" className="skip-link">
      {t('accessibility.skipToContent', 'Skip to main content')}
    </a>
  );
}
