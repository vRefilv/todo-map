import { GetStaticProps, NextPage } from "next";
import fs from "fs";
import path from "path";
import React from "react";
import Card from "../components/Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeJumpIn from "@/components/FadeJumpIn";
import {
  parseContent,
  ParsedContent,
  SectionContent,
  parseAttributes,
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

const parseCustomTags = (content: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  const customTagRegex = /<(embed|image|link)(\s+[^>]+)?\s*\/>/g;
  let match;
  while ((match = customTagRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(content.substring(lastIndex, match.index));
    }
    const tagName = match[1];
    const attrString = match[2] || "";
    const attrs = parseAttributes(attrString);
    if (tagName === "embed") {
      const url = attrs.url;
      if (typeof url === "string") {
        let embedUrl = url;
        if (url.includes("youtu.be")) {
          const parts = url.split("/");
          const videoId = parts.pop() || "";
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        nodes.push(
          <iframe
            key={`embed-${match.index}`}
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-64 my-4"
          />
        );
      }
    } else if (tagName === "image") {
      const url = attrs.url;
      if (typeof url === "string") {
        nodes.push(
          <img key={`image-${match.index}`} src={url} alt="" className="my-4" />
        );
      }
    } else if (tagName === "link") {
      const url = attrs.url;
      const name = attrs.name || url;
      if (typeof url === "string") {
        nodes.push(
          <a
            key={`link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 underline hover:text-purple-700"
          >
            {name}
          </a>
        );
      }
    }
    lastIndex = customTagRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    nodes.push(content.substring(lastIndex));
  }
  return nodes;
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
      const plainText = content.substring(lastIndex, index);
      nodes.push(...parseCustomTags(plainText));
      keyCounter++;
    }
    const classes = match[1].trim();
    const innerContent = match[2];
    nodes.push(
      <span className={classes} key={`style-${keyCounter++}`}>
        {parseCustomTags(innerContent)}
      </span>
    );
    lastIndex = styleRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    nodes.push(...parseCustomTags(content.substring(lastIndex)));
  }
  return nodes;
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

const Home: NextPage<HomeProps> = ({ content }) => {
  const navContent = content.nav ? content.nav.content : "";
  const sections = content.sections;
  const footerContent =
    content.footer?.content || "%year% Refilz - Always coding with passion.";

  return (
    <>
      <Header navContent={navContent} />
      {/* Using scroll snapping so that on desktop only one section is visible at a time */}
      <div className="min-h-screen bg-bg text-primary font-sans pt-20 p-4 snap-y snap-mandatory">
        {sections.map((section: SectionContent, index: number) => {
          const widthClass =
            (section.width && widthMapping[section.width]) || "max-w-3xl";
          if (section.type === "projects") {
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
              <FadeJumpIn
                key={section.id}
                delay={index * 100}
                className="snap-start"
              >
                <Card
                  id={section.id}
                  title={parseStyledContent(section.title || section.id)}
                  animate={false}
                  className={`mb-[150px] ${widthClass} mx-auto`}
                  contentClassName="w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 m-2">
                    {projectCards.map((project, i) => (
                      <FadeJumpIn key={i} delay={i * 100} className="contents">
                        <Card animate={true} className="bg-project p-4">
                          <h4 className="text-xl font-bold mb-2">
                            {parseStyledContent(project.projectTitle)}
                          </h4>
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {parseStyledContent(project.projectDescription)}
                          </p>
                        </Card>
                      </FadeJumpIn>
                    ))}
                  </div>
                </Card>
              </FadeJumpIn>
            );
          } else {
            return (
              <FadeJumpIn
                key={section.id}
                delay={index * 100}
                className="snap-start"
              >
                <Card
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
              </FadeJumpIn>
            );
          }
        })}
      </div>
      <Footer content={parseStyledContent(footerContent)} />
    </>
  );
};

export default Home;
