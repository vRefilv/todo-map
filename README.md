# Content Tutorial for Your Next.js Project

This project uses a custom **content.txt** file (located in the `public/` folder) as a lightweight CMS. The file defines different sections of your site using custom tags (such as `<header>`, `<about>`, and `<projects>`) and inline style tags for applying Tailwind CSS classes.

## Table of Contents

- [Overview](#overview)
- [Content File Structure](#content-file-structure)
- [Inline Styling with Custom Tags](#inline-styling-with-custom-tags)
- [How It Works in Code](#how-it-works-in-code)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Overview

Instead of hardcoding content in your React components, this project reads text from a **content.txt** file. The file is parsed at build time by Next.js (via `getStaticProps`) so that your site can easily be updated by editing the content file.

## Content File Structure

Your **content.txt** file is structured using custom tags for each section. For example:

```html
<header>
  <title>✋ Hi! I'm <style text-purple-500>Refil</style></title>

  • 3 years of programming experience. • Currently developing next.js fullstack
  websites • Right now I’m working on School Radio Station Website 📍 Living in
  Poland 🇵🇱 Always open to learning and building! 🚀
</header>

<about>
  <title>🚀 About Me</title>
  Hey! I'm Refil, a passionate developer with 3 years of programming experience.
  My coding journey started in 2022 with Python, but fun fact — I’ve had a
  GitHub account since 2019, meaning I could’ve started even earlier! As a
  Prompt Engineer & Developer, I specialize in Python, JavaScript, and PHP.
  Currently, I’m leveling up with Java, TypeScript, React, Next.js,
  Tailwind.css, and C#, always staying ahead of the curve. 💻 What I'm Working
  On Right now, I'm focused on building full-stack Next.js applications while
  developing several exciting projects.
</about>

<projects>
  <title>🔥 Projects – My Todo Map</title>
  1. 🎙️ School Radio Station Website A platform for managing a school radio
  station, featuring: - PostgreSQL database for storing schedules, shows, and
  user data - Next.js frontend for a sleek and dynamic UI - Express.js / Next.js
  backend for handling user interactions and data flow 2. ⛏️ Minecraft Prison
  Server A fully customized Minecraft Prison server with: - Custom Paper plugins
  for unique game mechanics - Next.js-powered server website for player stats,
  leaderboards, and more 3. 📱 Mobile App for My Dad A personalized mobile
  application designed to assist with reading and storing information: - Python
  OpenCV for text recognition and processing - Lightweight database for quick
  and cost-effective data storage - React Native / Kivy-Python for a smooth and
  user-friendly mobile UI 4. 🛒 Custom Drop Shipping Shop A fully functional
  online store for drop shipping, featuring: - Payment integration for secure
  transactions - Custom backend to manage products, orders, and automation -
  Optimized frontend for a seamless shopping experience 5. 📄 CV Generator A
  Next.js-based web app to help users create professional resumes quickly and
  easily. 6. 📝 Bios & Portfolio A set of well-structured bios to fit different
  use cases: - Terminal Bio – for CLI enthusiasts - Regular Bio – for general
  introductions - Portfolio Bio – for showcasing my work professionally.
</projects>
```

Each section is wrapped by its tag (e.g., `<header>` ... `</header>`). Inside these sections, an optional `<title>` tag defines the section title. The remaining text becomes the section’s content.

## Inline Styling with Custom Tags

You can emphasize parts of your content using custom inline style tags. For example:

```html
<style text-purple-500>
  Refil
</style>
```

The code includes a helper function (`parseStyledContent`) that converts these tags into React `<span>` elements with the specified Tailwind classes. This lets you mix content with dynamic styling directly in **content.txt**.

## How It Works in Code

- **Reading the File:**  
  The `getStaticProps` function (in `pages/index.tsx`) reads the **content.txt** file from the `public/` folder.

- **Parsing Sections:**  
  A regex is used to find sections like `<header> ... </header>`. It also extracts the inner `<title>` tags (if present) and sets the remaining text as the section content.

- **Inline Styles:**  
  The `parseStyledContent` function scans each content string for `<style>` tags and converts them into React elements with Tailwind classes.

- **Rendering:**  
  The content is then rendered inside custom `<Card>` components on the homepage, preserving the custom formatting from **content.txt**.

## Usage

1. **Edit Content:**  
   Open `public/content.txt` and modify the text within the custom tags. Update or add new sections as needed (following the same structure).

2. **Add or Change Styles:**  
   Use inline `<style>` tags to apply different Tailwind classes. For example, you can mix purple and pink shades:

   ```html
   <style text-purple-500>
     Primary Text
   </style>
   <style text-pink-500>
     Accent Text
   </style>
   ```

3. **Rebuild and Run:**  
   After saving your changes to **content.txt**, rebuild the project:
   ```bash
   npm run build
   npm run start
   ```
   Or run in development mode:
   ```bash
   npm run dev
   ```
   The updated content will be available on the homepage.

## Troubleshooting

- **Content Not Updating:**  
  Ensure that **content.txt** is saved in the `public/` directory and follows the correct tag structure.

- **Parsing Issues:**  
  If styled text isn’t rendering as expected, double-check that your inline style tags are properly closed and that you are using the correct Tailwind classes.

- **Custom Formatting:**  
  The code expects a very specific format. Any deviation may cause sections to be skipped. Review the regular expressions in `getStaticProps` if you plan to extend the formatting.
