import { GetStaticProps, NextPage } from "next";
import fs from "fs";
import path from "path";
import React from "react";
import Card from "../components/Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  parseContent,
  ParsedContent,
  SectionContent,
} from "@/utils/parseContent";

// Mapping from wide attribute value to Tailwind max-width class
const widthMapping: { [key: string]: string } = {
  "1": "max-w-xl",
  "2": "max-w-2xl",
  "3": "max-w-3xl",
  "4": "max-w-4xl",
  "5": "max-w-5xl",
  "6": "max-w-6xl",
  "7": "max-w-7xl",
};

interface HomeProps {
  content: ParsedContent;
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  const defaultLocale = "en";
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

  const parsedContent = parseContent(fileContent);

  return {
    props: { content: parsedContent },
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
  const navContent = content.nav ? content.nav.content : "";
  const sections = content.sections;
  const footerContent =
    content.footer?.content || "%year% Refilz - Always coding with passion.";

  return (
    <>
      <Header navContent={navContent} />
      <div className="min-h-screen bg-bg text-primary font-sans pt-20 p-4">
        {sections.map((section: SectionContent) => {
          const widthClass =
            (section.width && widthMapping[section.width]) || "max-w-3xl";
          if (section.type === "projects") {
            // Special rendering for projects sections
            const rawProjectCards = section.content
              .split(/\n{2,}/)
              .filter((card) => card.trim().length > 0);
            const projectCards = rawProjectCards.map((card) => {
              const lines = card
                .split("\n")
                .filter((line) => line.trim() !== "");
              const projectTitle = lines[0] || "";
              const projectDescription = lines.slice(1).join("\n");
              return { projectTitle, projectDescription };
            });
            return (
              <Card
                key={section.id}
                id={section.id}
                title={parseStyledContent(section.title || section.id)}
                animate={false}
                className={`mb-[150px] ${widthClass} mx-auto`}
                contentClassName="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 m-2">
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
            );
          } else {
            return (
              <Card
                key={section.id}
                id={section.id}
                title={parseStyledContent(section.title || section.id)}
                animate={true}
                className={`mb-[150px] ${widthClass} mx-auto`}
              >
                {section.content.split("\n").map((line, idx) => (
                  <p key={idx} className="mb-2">
                    {parseStyledContent(line)}
                  </p>
                ))}
              </Card>
            );
          }
        })}
      </div>
      <Footer content={footerContent} />
    </>
  );
};

export default Home;
