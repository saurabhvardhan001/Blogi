import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Typography, Link } from '@mui/material';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        // helper to build an id from heading text
        // (keeps ids consistent for TOC hash links)
        h1: ({ node, ...props }) => {
          const getText = (n) => (n?.children || []).map(c => typeof c.value === 'string' ? c.value : getText(c)).join('') || '';
          const slugify = (s) => s.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          const id = slugify(getText(node));
          return <Typography id={id} variant="h4" gutterBottom {...props} />;
        },
        h2: ({ node, ...props }) => {
          const getText = (n) => (n?.children || []).map(c => typeof c.value === 'string' ? c.value : getText(c)).join('') || '';
          const slugify = (s) => s.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          const id = slugify(getText(node));
          return <Typography id={id} variant="h5" gutterBottom sx={{ mt: 3 }} {...props} />;
        },
        h3: ({ node, ...props }) => {
          const getText = (n) => (n?.children || []).map(c => typeof c.value === 'string' ? c.value : getText(c)).join('') || '';
          const slugify = (s) => s.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          const id = slugify(getText(node));
          return <Typography id={id} variant="h6" gutterBottom sx={{ mt: 2 }} {...props} />;
        },
        p:  ({ node, ...props }) => <Typography paragraph {...props} />,
        a: ({ node, href, children, ...props }) => {
          const isExternal = href && /^(https?:|mailto:|\/\/)/.test(href);
          const isHash = href && href.startsWith('#');
          const handleClick = (e) => {
            if (!isHash) return;
            const id = href.slice(1);
            const el = document.getElementById(id);
            if (el) {
              // only prevent default if we can handle the scroll
              e.preventDefault();
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              history.replaceState(null, '', href);
            }
            // if el not found, allow default (browser will update URL / try to jump)
          };
          return (
            <Link
              {...props}
              href={href}
              onClick={handleClick}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener' : undefined}
            >
              {children}
            </Link>
          );
        },
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline ? (
            <SyntaxHighlighter style={oneDark} language={match?.[1] || 'text'} PreTag="div" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props} style={{ background: '#efefef', padding: '2px 6px', borderRadius: 4 }}>
              {children}
            </code>
          );
        },
        ul: (props) => <ul style={{ paddingLeft: 24, marginTop: 8 }}>{props.children}</ul>,
        ol: (props) => <ol style={{ paddingLeft: 24, marginTop: 8 }}>{props.children}</ol>,
        table: (props) => <div style={{ overflowX: 'auto' }}><table {...props} /></div>,
      }}
    >
      {content || ''}
    </ReactMarkdown>
  );
}