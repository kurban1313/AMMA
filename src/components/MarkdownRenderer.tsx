// AMMA Healthcare Platform - Markdown Renderer for AI output
// Converts markdown text to structured React elements

import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const renderMarkdown = (text: string): React.ReactNode[] => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Table detection: line contains | characters
            if (line.trim().includes('|') && line.trim().startsWith('|')) {
                const tableLines: string[] = [];
                while (i < lines.length && lines[i].trim().includes('|')) {
                    tableLines.push(lines[i]);
                    i++;
                }
                elements.push(renderTable(tableLines, elements.length));
                continue;
            }

            // Heading ### 
            if (line.startsWith('### ')) {
                elements.push(
                    <h4 key={`h3-${i}`} className="text-sm font-bold text-[#1f1f1f] mt-3 mb-1">
                        {renderInline(line.slice(4))}
                    </h4>
                );
                i++;
                continue;
            }

            // Heading ##
            if (line.startsWith('## ')) {
                elements.push(
                    <h3 key={`h2-${i}`} className="text-base font-bold text-[#1f1f1f] mt-4 mb-2">
                        {renderInline(line.slice(3))}
                    </h3>
                );
                i++;
                continue;
            }

            // Heading #
            if (line.startsWith('# ')) {
                elements.push(
                    <h2 key={`h1-${i}`} className="text-lg font-bold text-[#1f1f1f] mt-4 mb-2">
                        {renderInline(line.slice(2))}
                    </h2>
                );
                i++;
                continue;
            }

            // Code block ```
            if (line.trim().startsWith('```')) {
                const codeLines: string[] = [];
                i++;
                while (i < lines.length && !lines[i].trim().startsWith('```')) {
                    codeLines.push(lines[i]);
                    i++;
                }
                i++; // skip closing ```
                elements.push(
                    <pre key={`code-${i}`} className="bg-[#1f1f1f] text-[#a5d6ff] text-xs rounded-lg p-3 my-2 overflow-x-auto font-mono">
                        <code>{codeLines.join('\n')}</code>
                    </pre>
                );
                continue;
            }

            // Unordered list item (- or *)
            if (line.trimStart().startsWith('- ') || line.trimStart().startsWith('* ')) {
                const listItems: string[] = [];
                while (i < lines.length && (lines[i].trimStart().startsWith('- ') || lines[i].trimStart().startsWith('* '))) {
                    listItems.push(lines[i].trimStart().slice(2));
                    i++;
                }
                elements.push(
                    <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 text-sm">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-[#33383f]">{renderInline(item)}</li>
                        ))}
                    </ul>
                );
                continue;
            }

            // Numbered list
            if (/^\d+\.\s/.test(line.trimStart())) {
                const listItems: string[] = [];
                while (i < lines.length && /^\d+\.\s/.test(lines[i].trimStart())) {
                    listItems.push(lines[i].trimStart().replace(/^\d+\.\s/, ''));
                    i++;
                }
                elements.push(
                    <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2 text-sm">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-[#33383f]">{renderInline(item)}</li>
                        ))}
                    </ol>
                );
                continue;
            }

            // Horizontal rule
            if (line.trim() === '---' || line.trim() === '***') {
                elements.push(<hr key={`hr-${i}`} className="my-3 border-[#dee5eb]" />);
                i++;
                continue;
            }

            // Empty line
            if (line.trim() === '') {
                i++;
                continue;
            }

            // Regular paragraph
            elements.push(
                <p key={`p-${i}`} className="text-sm leading-relaxed text-[#33383f] my-1">
                    {renderInline(line)}
                </p>
            );
            i++;
        }

        return elements;
    };

    // Render inline formatting: **bold**, *italic*, `code`, [links](url)
    const renderInline = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let remaining = text;
        let keyIdx = 0;

        while (remaining.length > 0) {
            // Bold **text**
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            // Inline code `text`
            const codeMatch = remaining.match(/`([^`]+)`/);
            // Italic *text* (not bold)
            const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

            // Find the earliest match
            const matches = [
                boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
                codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
                italicMatch ? { type: 'italic', match: italicMatch, index: italicMatch.index! } : null,
            ].filter(Boolean).sort((a, b) => a!.index - b!.index);

            if (matches.length === 0) {
                parts.push(remaining);
                break;
            }

            const first = matches[0]!;

            // Text before the match
            if (first.index > 0) {
                parts.push(remaining.slice(0, first.index));
            }

            if (first.type === 'bold') {
                parts.push(
                    <strong key={`b-${keyIdx++}`} className="font-semibold text-[#1f1f1f]">
                        {first.match[1]}
                    </strong>
                );
                remaining = remaining.slice(first.index + first.match[0].length);
            } else if (first.type === 'code') {
                parts.push(
                    <code key={`c-${keyIdx++}`} className="px-1.5 py-0.5 bg-[#e6f7ff] text-[#0070a0] rounded text-xs font-mono">
                        {first.match[1]}
                    </code>
                );
                remaining = remaining.slice(first.index + first.match[0].length);
            } else if (first.type === 'italic') {
                parts.push(
                    <em key={`i-${keyIdx++}`}>{first.match[1]}</em>
                );
                remaining = remaining.slice(first.index + first.match[0].length);
            }
        }

        return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
    };

    // Render markdown table
    const renderTable = (tableLines: string[], baseKey: number): React.ReactNode => {
        const rows = tableLines
            .filter(line => !line.trim().match(/^\|[\s\-:|]+\|$/)) // filter separator row
            .map(line =>
                line.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0)
            );

        if (rows.length === 0) return null;

        const header = rows[0];
        const body = rows.slice(1);

        return (
            <div key={`table-${baseKey}`} className="my-3 overflow-x-auto rounded-lg border border-[#dee5eb]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#e6f7ff]">
                            {header.map((cell, idx) => (
                                <th key={idx} className="px-3 py-2 text-left font-semibold text-[#0070a0] text-xs uppercase tracking-wide">
                                    {renderInline(cell)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {body.map((row, rowIdx) => (
                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fa]'}>
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="px-3 py-2 text-[#33383f] border-t border-[#dee5eb]">
                                        {renderInline(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={`markdown-content ${className}`}>
            {renderMarkdown(content)}
        </div>
    );
}
