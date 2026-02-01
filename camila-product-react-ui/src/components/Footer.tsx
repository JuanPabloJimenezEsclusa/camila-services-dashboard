import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">{t('appTitle', 'Camila Product Dashboard')}</h3>
          <p className="footer-description">
            {t('footer.description', 'Enterprise Product Management Platform')}
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.license', 'License')}</h4>
          <p className="footer-text">
            <a
              href="https://www.gnu.org/licenses/gpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {t('footer.licenseName', 'GNU GPL v3.0')}
            </a>
          </p>
          <p className="footer-text footer-license-note">
            {t('footer.licenseNote', 'Free and open source software')}
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.resources', 'Resources')}</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="GitHub"
              >
                <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://gitlab.com/side-projects9205424/camila-services-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="GitLab"
              >
                <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.465 10.93c-.62.62-.62 1.62 0 2.24l10.412 10.412c.604.603 1.582.603 2.188 0l10.48-10.412c.62-.62.62-1.62 0-2.24zm-6.47 5.35l-5.076 1.522-5.076-1.522-1.096-3.372 6.172-1.85 6.172 1.85-1.096 3.372z"/>
                </svg>
                GitLab
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.social', 'Social Media')}</h4>
          <div className="footer-social-links">
            <a
              href="https://www.linkedin.com/company/camila-services-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com/camila_services"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://github.com/JuanPabloJimenezEsclusa/camila-services-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://gitlab.com/side-projects9205424/camila-services-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitLab"
              title="GitLab"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.465 10.93c-.62.62-.62 1.62 0 2.24l10.412 10.412c.604.603 1.582.603 2.188 0l10.48-10.412c.62-.62.62-1.62 0-2.24zm-6.47 5.35l-5.076 1.522-5.076-1.522-1.096-3.372 6.172-1.85 6.172 1.85-1.096 3.372z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">{t('footer.protocols', 'API Protocols')}</h4>
          <ul className="footer-list">
            <li>REST API</li>
            <li>GraphQL</li>
            <li>gRPC</li>
            <li>RSocket</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} {t('footer.copyright', 'Camila Services Dashboard. All rights reserved.')}
        </p>
        <p className="footer-tech">
          {t('footer.builtWith', 'Built with')} <span className="footer-heart">❤️</span>
          {t('footer.using', 'using')} React, TypeScript & Vite
        </p>
      </div>
    </footer>
  );
}
