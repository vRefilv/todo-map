# Dynamic Bio/Portfolio Generator

🌐 Next.js website with text-file content management

## Table of Contents
- [Overview](#overview)
- [Content File Structure](#content-file-structure)
- [Inline Styling with Custom Tags](#inline-styling-with-custom-tags)
- [How It Works in Code](#how-it-works-in-code)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [License](#license)

<a name="overview"></a>
## 🌟 Overview

- Edit **everything** through `content.txt` files
- Multi-language ready (i18n via folder structure)
- Built-in components for:
  - Project showcases
  - Responsive embeds
  - Styled links
  - Custom text formatting
- Automatic year replacement in footer
- Zero database required

<a name="content-file-structure"></a>
## 📂 Content File Structure

```txt
public/
  en/              # English content
    content.txt
  es/              # Spanish content
    content.txt
  pl/              # Polish content
    content.txt
```

Basic template:
```txt
<nav>
Site Title

Menu1#section1
Menu2#section2
</nav>

<section id="section1" wide="4">
<title>Section Title</title>
Content with <style text-blue-500>styled text</style>
</section>

<footer>
%year% - <link url="https://github.com" name="Repository"/>
</footer>
```

<a name="inline-styling-with-custom-tags"></a>
## 🎨 Inline Styling with Custom Tags

### Text Formatting
```txt
<style [tailwind-classes]>content</style>
Example: <style text-purple-500 font-bold>Bold Purple</style>
```

### Media Embeds
```txt
<embed url="https://youtu.be/..."> (YouTube/Vimeo)
<image url="/image.jpg"> (from public folder)
```

### Smart Links
```txt
<link url="https://..." name="Link Text">
```

<a name="how-it-works-in-code"></a>
## 💻 How It Works in Code

Key files:
```
components/
  Card.tsx       # Section container
  Header.tsx     # Navigation parser
  Footer.tsx     # Year replacement
utils/
  parseContent.ts # Content parser with:
                  - Tag detection
                  - Section splitting
                  - Style mapping
```

Content parsing flow:
1. Read `content.txt`
2. Split into nav/sections/footer
3. Convert custom tags to React components
4. Apply Tailwind classes dynamically

<a name="usage"></a>
## 🚀 Usage

1. Clone repo
```bash
git clone https://github.com/your-repo.git
```

2. Edit content
```bash
nano public/en/content.txt
```

3. Add languages
```bash
mkdir public/es && cp public/en/content.txt public/es/
```

4. Run dev server
```bash
npm run dev
```

<a name="troubleshooting"></a>
## 🔧 Troubleshooting

**Content not updating?**
- Ensure file is in correct locale folder
- Check for unclosed tags
- Restart dev server if making structural changes

**Custom tags not rendering?**
- Verify proper tag syntax: `<tag attribute="value"/>`
- Check console for parsing errors
- Ensure attributes use double quotes

**Styling not applying?**
- Confirm valid Tailwind classes
- Check for conflicting classes
- Verify `<style>` tags are properly closed

<a name="license"></a>
## ⚖ License
MIT License - Free for personal/commercial use
