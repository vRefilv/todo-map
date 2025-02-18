import React from "react";

interface CardProps {
  id?: string;
  children: React.ReactNode;
  title?: React.ReactNode;
  animate?: boolean;
  className?: string;
  contentClassName?: string; // New prop to override inner container classes
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  animate = true,
  className,
  contentClassName,
  children,
}) => {
  const animationClasses = animate
    ? "transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    : "";
  const hover =
    "hover:border-border hover:border-l-[5px] hover:rounded-xl hover:transition-all hover:duration-200";
  return (
    <div
      id={id}
      className={`bg-card p-6 rounded-xl shadow-md ${animationClasses} ${className} ${hover} border-border`}
    >
      {title && (
        <h3 className="text-2xl font-bold border-border pb-2 mb-4 border-b-[5px] rounded-xl">
          {title}
        </h3>
      )}
      <div
        className={`whitespace-pre-wrap text-primary p-1 ${
          contentClassName || "max-w-prose mx-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
