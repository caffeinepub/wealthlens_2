import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Code,
  Columns2,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";
import { useRef, useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  "data-ocid"?: string;
}

function insertMarkdown(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string,
  defaultText: string,
  onChange: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const replacement = selected || defaultText;
  const newText =
    textarea.value.substring(0, start) +
    prefix +
    replacement +
    suffix +
    textarea.value.substring(end);
  onChange(newText);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + prefix.length,
      start + prefix.length + replacement.length,
    );
  });
}

function insertLinePrefix(
  textarea: HTMLTextAreaElement,
  linePrefix: string,
  onChange: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const textBefore = textarea.value.substring(0, start);
  const lineStart = textBefore.lastIndexOf("\n") + 1;
  const newText =
    textarea.value.substring(0, lineStart) +
    linePrefix +
    textarea.value.substring(lineStart);
  onChange(newText);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + linePrefix.length,
      start + linePrefix.length,
    );
  });
}

// Simple inline Markdown renderer (no dangerouslySetInnerHTML)
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
    if (boldMatch) {
      if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
      parts.push(<strong key={key++}>{boldMatch[2]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    // Italic
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/);
    if (italicMatch) {
      if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
      parts.push(<em key={key++}>{italicMatch[2]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }
    // Inline code
    const codeMatch = remaining.match(/^(.*?)`(.+?)`/);
    if (codeMatch) {
      if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>);
      parts.push(
        <code
          key={key++}
          className="bg-muted px-1 py-0.5 rounded text-xs font-mono"
        >
          {codeMatch[2]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }
    // Link
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)/);
    if (linkMatch) {
      if (linkMatch[1]) parts.push(<span key={key++}>{linkMatch[1]}</span>);
      parts.push(
        <a
          key={key++}
          href={linkMatch[3]}
          className="text-primary underline"
          target="_blank"
          rel="noreferrer"
        >
          {linkMatch[2]}
        </a>,
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }
    // No more patterns
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }
  return parts;
}

function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto mb-4 whitespace-pre-wrap"
        >
          {codeLines.join("\n")}
        </pre>,
      );
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="font-display text-2xl font-bold mt-6 mb-3 text-foreground"
        >
          {renderInline(line.slice(2))}
        </h1>,
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="font-display text-xl font-bold mt-5 mb-2 text-foreground"
        >
          {renderInline(line.slice(3))}
        </h2>,
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="font-display text-lg font-semibold mt-4 mb-2 text-foreground"
        >
          {renderInline(line.slice(4))}
        </h3>,
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      elements.push(<hr key={i} className="my-4 border-border" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground text-sm my-3"
        >
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc ml-5 mb-3 space-y-1">
          {items.map((item) => (
            <li key={item} className="text-sm text-muted-foreground">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal ml-5 mb-3 space-y-1">
          {items.map((item) => (
            <li key={item} className="text-sm text-muted-foreground">
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Image
    const imgMatch = line.match(/^!\[(.*)\]\((.+)\)$/);
    if (imgMatch) {
      elements.push(
        <img
          key={i}
          src={imgMatch[2]}
          alt={imgMatch[1]}
          className="max-w-full rounded-md my-3"
        />,
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />);
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  if (elements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground/50 italic">
        Preview akan muncul di sini...
      </p>
    );
  }

  return <div className="preview-content">{elements}</div>;
}

interface ToolbarButton {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ToolbarGroup {
  id: string;
  buttons: ToolbarButton[];
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  required,
  "data-ocid": dataOcid,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewMode, setPreviewMode] = useState<"edit" | "split" | "preview">(
    "edit",
  );

  const exec = (prefix: string, suffix: string, defaultText: string) => {
    if (textareaRef.current) {
      insertMarkdown(
        textareaRef.current,
        prefix,
        suffix,
        defaultText,
        onChange,
      );
    }
  };

  const execLine = (linePrefix: string) => {
    if (textareaRef.current) {
      insertLinePrefix(textareaRef.current, linePrefix, onChange);
    }
  };

  const insertLink = () => {
    const text = linkText || "teks link";
    const url = linkUrl || "https://";
    exec(`[${text}](`, ")", url);
    setLinkOpen(false);
    setLinkText("");
    setLinkUrl("");
  };

  const insertImage = () => {
    const alt = imageAlt || "gambar";
    const url = imageUrl || "https://";
    exec(`![${alt}](`, ")", url);
    setImageOpen(false);
    setImageAlt("");
    setImageUrl("");
  };

  const toolbarGroups: ToolbarGroup[] = [
    {
      id: "text-style",
      buttons: [
        {
          label: "Bold",
          icon: <Bold size={14} />,
          action: () => exec("**", "**", "teks bold"),
        },
        {
          label: "Italic",
          icon: <Italic size={14} />,
          action: () => exec("*", "*", "teks italic"),
        },
      ],
    },
    {
      id: "headings",
      buttons: [
        {
          label: "Heading 1",
          icon: <Heading1 size={14} />,
          action: () => execLine("# "),
        },
        {
          label: "Heading 2",
          icon: <Heading2 size={14} />,
          action: () => execLine("## "),
        },
      ],
    },
    {
      id: "lists",
      buttons: [
        {
          label: "Bullet List",
          icon: <List size={14} />,
          action: () => execLine("- "),
        },
        {
          label: "Numbered List",
          icon: <ListOrdered size={14} />,
          action: () => execLine("1. "),
        },
        {
          label: "Blockquote",
          icon: <Quote size={14} />,
          action: () => execLine("> "),
        },
      ],
    },
    {
      id: "code-misc",
      buttons: [
        {
          label: "Inline Code",
          icon: <Code size={14} />,
          action: () => exec("`", "`", "kode"),
        },
        {
          label: "Garis Horizontal",
          icon: <Minus size={14} />,
          action: () => exec("\n---\n", "", ""),
        },
      ],
    },
  ];

  const cyclePreview = () => {
    setPreviewMode((m) =>
      m === "edit" ? "split" : m === "split" ? "preview" : "edit",
    );
  };

  const previewIcon =
    previewMode === "edit" ? (
      <Eye size={14} />
    ) : previewMode === "split" ? (
      <Columns2 size={14} />
    ) : (
      <EyeOff size={14} />
    );

  const previewLabel =
    previewMode === "edit"
      ? "Tampilkan Preview"
      : previewMode === "split"
        ? "Mode Split"
        : "Sembunyikan Preview";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/40 border-b border-input">
          {previewMode !== "preview" &&
            toolbarGroups.map((group, idx) => (
              <div key={group.id} className="flex items-center gap-0.5">
                {idx > 0 && (
                  <span className="w-px h-4 bg-border mx-1 inline-block" />
                )}
                {group.buttons.map((btn) => (
                  <Tooltip key={btn.label}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={btn.action}
                        className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label={btn.label}
                      >
                        {btn.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {btn.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}

          {/* Separator before link/image */}
          {previewMode !== "preview" && (
            <span className="w-px h-4 bg-border mx-1 inline-block" />
          )}

          {/* Link Popover */}
          {previewMode !== "preview" && (
            <Popover open={linkOpen} onOpenChange={setLinkOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      data-ocid="create_article.insert_link.button"
                      className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Sisipkan Link"
                    >
                      <Link size={14} />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Sisipkan Link
                </TooltipContent>
              </Tooltip>
              <PopoverContent
                className="w-72 p-3"
                data-ocid="create_article.link.popover"
              >
                <p className="text-sm font-medium mb-3">Sisipkan Link</p>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Teks</Label>
                    <Input
                      data-ocid="create_article.link_text.input"
                      placeholder="Teks yang ditampilkan"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input
                      data-ocid="create_article.link_url.input"
                      placeholder="https://..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && insertLink()}
                    />
                  </div>
                  <Button
                    data-ocid="create_article.insert_link.primary_button"
                    size="sm"
                    className="w-full h-8 mt-1"
                    onClick={insertLink}
                  >
                    Sisipkan
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Image Popover */}
          {previewMode !== "preview" && (
            <Popover open={imageOpen} onOpenChange={setImageOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      data-ocid="create_article.insert_image.button"
                      className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Sisipkan Gambar"
                    >
                      <Image size={14} />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Sisipkan Gambar
                </TooltipContent>
              </Tooltip>
              <PopoverContent
                className="w-72 p-3"
                data-ocid="create_article.image.popover"
              >
                <p className="text-sm font-medium mb-3">Sisipkan Gambar</p>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Teks Alt</Label>
                    <Input
                      data-ocid="create_article.image_alt.input"
                      placeholder="Deskripsi gambar"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL Gambar</Label>
                    <Input
                      data-ocid="create_article.image_url.input"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && insertImage()}
                    />
                  </div>
                  <Button
                    data-ocid="create_article.insert_image.primary_button"
                    size="sm"
                    className="w-full h-8 mt-1"
                    onClick={insertImage}
                  >
                    Sisipkan
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Preview toggle - pushed to end */}
          <div className="ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={cyclePreview}
                  className={`inline-flex items-center justify-center gap-1.5 px-2.5 h-7 rounded text-xs transition-colors ${
                    previewMode !== "edit"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  aria-label={previewLabel}
                >
                  {previewIcon}
                  <span className="hidden sm:inline">{previewLabel}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {previewMode === "edit"
                  ? "Aktifkan split preview"
                  : previewMode === "split"
                    ? "Mode preview penuh"
                    : "Kembali ke mode edit"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Editor + Preview area */}
        <div
          className={`flex ${
            previewMode === "split" ? "divide-x divide-border" : ""
          }`}
        >
          {/* Textarea - hidden in preview mode */}
          {previewMode !== "preview" && (
            <textarea
              ref={textareaRef}
              data-ocid={dataOcid}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              rows={18}
              className={`px-3 py-2.5 bg-background font-mono text-sm resize-y outline-none placeholder:text-muted-foreground leading-relaxed ${
                previewMode === "split" ? "w-1/2" : "w-full"
              }`}
            />
          )}

          {/* Preview panel */}
          {previewMode !== "edit" && (
            <div
              className={`px-4 py-3 bg-background overflow-y-auto ${
                previewMode === "split" ? "w-1/2" : "w-full"
              }`}
              style={{
                minHeight: previewMode === "preview" ? "18rem" : undefined,
              }}
            >
              <MarkdownPreview content={value} />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
