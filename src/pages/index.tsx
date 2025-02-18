import { GetStaticProps, NextPage } from "next";
import fs from "fs";
import path from "path";
import Card from "../components/Card";
import React from "react";
import Header from "@/components/Header";

interface SectionContent {
  title?: string;
  content: string;
}

interface ContentSections {
  header: SectionContent;
  about: SectionContent;
  projects: SectionContent;
}

interface HomeProps {
  content: ContentSections;
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  const defaultLocale = "en"; // Set default locale

  // If no locale is provided, default to 'en'
  const contentLocale = locale || defaultLocale;
  const filePath = path.join(
    process.cwd(),
    "public",
    contentLocale,
    "content.txt"
  );

  let fileContent = "";
  try {
    fileContent = fs.readFileSync(filePath, "utf8");
  } catch {
    console.error(
      `Content file for locale '${contentLocale}' not found. Falling back to default locale '${defaultLocale}'.`
    );
    const defaultFilePath = path.join(
      process.cwd(),
      "public",
      defaultLocale,
      "content.txt"
    );
    fileContent = fs.readFileSync(defaultFilePath, "utf8");
  }

  const content: ContentSections = {
    header: { content: "" },
    about: { content: "" },
    projects: { content: "" },
  };

  const sectionRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = sectionRegex.exec(fileContent)) !== null) {
    const tag = match[1].toLowerCase();
    let text = match[2].trim();

    if (tag in content) {
      const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/);
      let sectionTitle = "";
      if (titleMatch) {
        sectionTitle = titleMatch[1].trim();
        text = text.replace(/<title>[\s\S]*?<\/title>/, "").trim();
      }
      content[tag as keyof ContentSections] = {
        title: sectionTitle,
        content: text,
      };
    }
  }

  return {
    props: { content },
  };
};

const parseStyledContent = (content: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let keyCounter = 0;
  const styleRegex = /<style\s+([^>]+)>([\s\S]*?)<\/style>/g;
  let lastIndex = 0;
  let match;

  while ((match = styleRegex.exec(content)) !== null) {
    const index = match.index;
    if (index > lastIndex) {
      nodes.push(content.substring(lastIndex, index));
      keyCounter++;
    }
    const classes = match[1].trim();
    const innerContent = match[2];
    nodes.push(
      <span className={classes} key={`style-${keyCounter++}`}>
        {innerContent}
      </span>
    );
    lastIndex = styleRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    nodes.push(content.substring(lastIndex));
  }
  return nodes;
};

const Home: NextPage<HomeProps> = ({ content }) => {
  const rawProjectCards = content.projects.content
    .split(/\n{2,}/)
    .filter((card) => card.trim().length > 0);
  const projectCards = rawProjectCards.map((card) => {
    const lines = card.split("\n").filter((line) => line.trim() !== "");
    const projectTitle = lines[0] || "";
    const projectDescription = lines.slice(1).join("\n");
    return { projectTitle, projectDescription };
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg text-primary font-sans pt-20 p-4">
        <Card
          id="welcome"
          title={parseStyledContent(content.header.title || "...")}
          animate={true}
          className="mb-[150px] max-w-2xl mx-auto"
        >
          {content.header.content.split("\n").map((line, idx) => (
            <p key={idx} className="mb-2">
              {parseStyledContent(line)}
            </p>
          ))}
        </Card>

        <Card
          id="about"
          title={parseStyledContent(content.about.title || "...")}
          animate={true}
          className="mb-[150px] max-w-3xl mx-auto"
        >
          {content.about.content.split("\n").map((line, idx) => (
            <p key={idx} className="mb-2">
              {parseStyledContent(line)}
            </p>
          ))}
        </Card>

        <Card
          id="projects"
          title={parseStyledContent(content.projects.title || "...")}
          animate={false}
          className="mb-[150px] max-w-4xl mx-auto"
          contentClassName="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectCards.map((project, index) => (
              <Card key={index} animate={true} className="bg-project p-4">
                <h4 className="text-xl font-bold mb-2">
                  {parseStyledContent(project.projectTitle)}
                </h4>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {parseStyledContent(project.projectDescription)}
                </p>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Home;
