export interface SectionContent {
  id: string;
  type: string; // "section", "projects", or "footer"
  title?: string;
  content: string;
  width: string | null; // explicitly set to a string (if provided) or null
}

export interface ParsedContent {
  nav?: SectionContent;
  sections: SectionContent[];
  footer?: SectionContent;
}

// Modified attribute parser to support boolean attributes (like "projects")
// Now exported so it can be reused in custom tag parsing.
export function parseAttributes(attrString: string): {
  [key: string]: string | boolean;
} {
  const attrs: { [key: string]: string | boolean } = {};
  const attrRegex = /(\w+)(?:="([^"]*)")?/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1];
    // If no value is provided, treat it as a boolean attribute (true)
    attrs[key] = match[2] === undefined ? true : match[2];
  }
  return attrs;
}

export function parseContent(fileContent: string): ParsedContent {
  const parsed: ParsedContent = { sections: [] };

  // Extract the dedicated <nav> block
  const navRegex = /<nav>([\s\S]*?)<\/nav>/i;
  const navMatch = fileContent.match(navRegex);
  if (navMatch) {
    const navContent = navMatch[1].trim();
    parsed.nav = { id: "nav", type: "nav", content: navContent, width: null };
  }

  // Extract the dedicated <footer> block
  const footerRegex = /<footer>([\s\S]*?)<\/footer>/i;
  const footerMatch = fileContent.match(footerRegex);
  if (footerMatch) {
    const footerContent = footerMatch[1].trim();
    parsed.footer = {
      id: "footer",
      type: "footer",
      content: footerContent,
      width: null,
    };
  }

  // Now, only support <section> tags for content
  const sectionRegex = /<section(\s+[^>]+)?>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = sectionRegex.exec(fileContent)) !== null) {
    const attrString = match[1] || "";
    const attrs = parseAttributes(attrString);
    const contentRaw = match[2].trim();
    let title = "";
    let content = contentRaw;
    const titleMatch = contentRaw.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
      content = contentRaw.replace(/<title>[\s\S]*?<\/title>/i, "").trim();
    }
    // Determine the id: use provided id or a default value
    const id = typeof attrs.id === "string" ? attrs.id : "section";
    // If the "projects" attribute is present, override the type to "projects"
    const type = attrs.projects ? "projects" : "section";
    parsed.sections.push({
      id,
      type,
      title,
      content,
      width: typeof attrs.wide === "string" ? attrs.wide : null,
    });
  }

  return parsed;
}
