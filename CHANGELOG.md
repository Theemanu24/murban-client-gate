# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [0.1.0] - 2025-08-13
### Added
- Initial scaffold with React + Vite + Tailwind + shadcn/ui
- Brand & theme tokens for Murban (#D62D06 primary, light/dark palettes)
- Animations (fade/scale/slide) and micro-interactions
- Home page with hero, Fuse.js search, featured clients grid
- Client page with Password Gate UI and Client Hub (sandboxed iframe + allowlist)
- Admin page scaffold
- Navbar with theme toggle, sticky header
- Components: SearchBar, ClientCard, PasswordGate, ClientHub, ThemeProvider
- README with setup, envs, allowlist, secrets rotation guidance
- CHANGELOG

### Security
- Placeholder client-side session (localStorage) for demo only; production to use secure HttpOnly cookies and server verification via Supabase

### Notes
- Backend endpoints (auth, admin CRUD, rate limiting, headers) will be implemented upon Supabase connection in Lovable.
