# Northstar CTF Static Site

A static Astro project skeleton for a CTF team website. All site content is driven by YAML files in `src/data`.

## Tech Stack

- Astro: page structure and static output
- TypeScript: data types and component contracts
- YAML: content authoring
- Plain CSS: layout, theme, and responsive styling

## Why This Stack

- Static output works well for GitHub Pages, Cloudflare Pages, and similar hosts
- Content and presentation stay clearly separated
- No backend, database, or runtime server features are required
- The structure is light enough for long-term maintenance and future multi-page expansion

## Project Structure

```text
.
|-- public/
|   |-- favicon.svg
|   |-- og-card.svg
|   `-- images/
|       |-- brand/logo-mark.svg
|       `-- members/*.svg
|-- src/
|   |-- components/
|   |   |-- HeroSection.astro
|   |   |-- AboutSection.astro
|   |   |-- MembersSection.astro
|   |   |-- HonorsSection.astro
|   |   |-- TimelineSection.astro
|   |   |-- RecruitmentSection.astro
|   |   `-- ...
|   |-- data/
|   |   |-- site.yaml
|   |   |-- members.yaml
|   |   |-- honors.yaml
|   |   |-- timeline.yaml
|   |   `-- recruitment.yaml
|   |-- layouts/BaseLayout.astro
|   |-- lib/data.ts
|   |-- pages/index.astro
|   |-- styles/global.css
|   `-- types/content.ts
|-- astro.config.mjs
|-- package.json
`-- tsconfig.json
```

## Data-Driven Content

- `src/data/site.yaml`: brand, SEO, navigation, section copy, and footer
- `src/data/members.yaml`: member profiles with `featured/current/alumni`
- `src/data/honors.yaml`: representative honors
- `src/data/timeline.yaml`: team history and milestones
- `src/data/recruitment.yaml`: recruitment copy, FAQ, and contact info

`src/lib/data.ts` reads `.yaml`, `.yml`, or `.json`, then normalizes the result so missing fields do not break rendering.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is written to `dist/`, ready for any static host.

## Deploy

### GitHub Pages

- Build command: `npm run build`
- Output directory: `dist`

### Cloudflare Pages

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`

### Any Static Hosting

- Upload the contents of `dist/`

## Editing Guide

- Update brand and section copy in `src/data/site.yaml`
- Update member data in `src/data/members.yaml`
- Update honors and milestones in `src/data/honors.yaml` and `src/data/timeline.yaml`
- Update recruitment content in `src/data/recruitment.yaml`
- Refine the visual system in `src/styles/global.css`

## Extension Ideas

- Split the site into `members`, `honors`, and `join` pages
- Add static writeup or archive pages
- Introduce MDX content pages while keeping the site fully static
- Add filters for different years or categories
- Add Lighthouse checks or formatting scripts
