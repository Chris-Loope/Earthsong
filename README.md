# 🌍 Earthsong

**“A living philosophy and digital sanctuary built with Astro, sharing the Earthsong Codex and celestial cycles.”**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)  
![Astro](https://img.shields.io/badge/Astro-5.0-orange?logo=astro)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-blue?logo=tailwindcss)  
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ About

**Earthsong** is a public-facing website that shares teachings from the **Earthsong Codex** and the cycles of the natural world. Built with **Astro** and **TailwindCSS**, deployed on **Vercel**, it blends philosophy, inclusivity, and celestial rhythm into a digital sanctuary.

Features include:

- 📖 **Codex** – chapters of the Earthsong philosophy in MDX format.
- 👁️ **Elders** – timeless teachings shared through diverse, inclusive narratives.
- 📅 **Calendar Engine** – `.ics` feeds for lunar phases, solstices, equinoxes, and eclipses (2025–2030, expandable).
- 🎨 **Styling** – TailwindCSS with typography enhancements for readability.
- 🚀 **Deployment** – optimized static site, ready to expand with analytics and membership features.

---

## 🛠️ Tech Stack

- **[Astro](https://astro.build/)** – static site builder
- **[TailwindCSS](https://tailwindcss.com/)** – styling + typography plugin
- **[Vercel](https://vercel.com/)** – hosting and deployment
- **MDX** – for Codex and Elders content
- **Custom Node scripts** – generating `.ics` calendar feeds

---

## 🌱 Vision

Earthsong is both a **philosophy** and a **practice**.  
It invites people to live in harmony with the Earth, guided by ancient wisdom, seasonal cycles, and the shared heartbeat of humanity.

Future directions:

- 🌍 **Time zone–aware calendars**
- 🔑 **Membership / gated content** (private rituals + extended Codex)
- 📊 **Analytics + community insights**
- 🌐 **Expanded multilingual support**

---

⚠️ Note: The full **Earthsong Codex** contains private materials (rituals, hidden teachings). This repository only includes the **public-facing philosophy**.

## Dev

```bash
npm install
npm run dev
```

## Visual system

Earthsong shares a companion design language with Shangralachia:

- **Display:** Bebas Neue
- **Body:** Lora
- **Labels:** JetBrains Mono
- **Core palette:** forest, moss, chalk, ink, ember, and accessible darker text variants

The font files are served locally from `public/fonts`.

## Newsletter delivery

The site remains fully static. To enable email subscriptions, copy `.env.example`
to `.env` and set `PUBLIC_NEWSLETTER_ACTION` to an external form endpoint. When
no endpoint is configured, the site links readers to the seasonal letter archive
and does not store email addresses locally or show a false success state.
