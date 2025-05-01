import React from 'react';
import { uiStyles } from '@/lib/ui-styles';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  title?: string;
  maxHeight?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language,
  title,
  maxHeight = "none",
  className = "",
}) => {
  return (
    <div className={`${uiStyles.border.default} rounded-md overflow-hidden ${className}`}>
      {title && (
        <div className={`px-3 py-1.5 text-xs font-medium ${uiStyles.bg.primary}`}>
          {title}
          {language && <span className="ml-2 opacity-70">{language}</span>}
        </div>
      )}
      <pre 
        className={`p-4 text-sm overflow-auto whitespace-pre-wrap break-all ${uiStyles.bg.code}`}
        style={{ maxHeight }}
        data-language={language || "text"}
      >
        <code className="font-mono">
          {children}
        </code>
      </pre>
    </div>
  );
};