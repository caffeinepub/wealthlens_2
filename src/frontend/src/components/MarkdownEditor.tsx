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

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/40 border-b border-input">
          {toolbarGroups.map((group, idx) => (
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
          <span className="w-px h-4 bg-border mx-1 inline-block" />

          {/* Link Popover */}
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

          {/* Image Popover */}
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
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          data-ocid={dataOcid}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={18}
          className="w-full px-3 py-2.5 bg-background font-mono text-sm resize-y outline-none placeholder:text-muted-foreground leading-relaxed"
        />
      </div>
    </TooltipProvider>
  );
}
