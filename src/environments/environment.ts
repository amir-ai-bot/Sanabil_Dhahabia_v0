// Configuration par environnement
// Dev: use relative /api so ng serve proxies to backend (run backend with: npm run backend)

export const environment = {
  production: false,
  apiUrl: '/api'
};

// Pour la production, créez un fichier environment.prod.ts avec:
// export const environment = {
//   production: true,
//   apiUrl: 'https://votre-domaine.com/backend/api'
// };
