import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limit for base64 file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/**
 * Extracts printable UTF-16LE and standard ASCII text strips from raw .one binary buffers.
 */
function extractOneNoteStrings(buffer: Buffer): string[] {
  const stringsSet = new Set<string>();
  
  // 1. Scan for UTF-16LE runs (standard for Microsoft structures)
  let currentString = "";
  for (let i = 0; i < buffer.length - 1; i += 2) {
    const charCode = buffer.readUInt16LE(i);
    // Filter standard readable characters and spaces
    if (
      (charCode >= 32 && charCode <= 126) ||
      charCode === 9 || // tab
      charCode === 10 || // LF
      charCode === 13 || // CR
      (charCode >= 192 && charCode <= 382) || // common European extended letters
      charCode === 8211 || charCode === 8212 || charCode === 8220 || charCode === 8221 // standard dashes/quotes
    ) {
      currentString += String.fromCharCode(charCode);
    } else {
      const trimmed = currentString.trim();
      if (trimmed.length >= 4 && !isJunkMetadata(trimmed)) {
        stringsSet.add(trimmed);
      }
      currentString = "";
    }
  }
  if (currentString.trim().length >= 4 && !isJunkMetadata(currentString.trim())) {
    stringsSet.add(currentString.trim());
  }

  // 2. Scan for UTF-8 / ASCII runs
  let currentAscii = "";
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    if (
      (byte >= 32 && byte <= 126) ||
      byte === 10 ||
      byte === 13 ||
      byte === 9
    ) {
      currentAscii += String.fromCharCode(byte);
    } else {
      const trimmed = currentAscii.trim();
      if (trimmed.length >= 5 && !isJunkMetadata(trimmed)) {
        stringsSet.add(trimmed);
      }
      currentAscii = "";
    }
  }
  if (currentAscii.trim().length >= 5 && !isJunkMetadata(currentAscii.trim())) {
    stringsSet.add(currentAscii.trim());
  }

  return Array.from(stringsSet);
}

/**
 * Filter out typical binary metadata, font listings, or noise strings.
 */
function isJunkMetadata(str: string): boolean {
  const lowercase = str.toLowerCase();
  
  // Ignore font names
  if (
    lowercase === "calibri" ||
    lowercase === "segoe ui" ||
    lowercase === "arial" ||
    lowercase === "wingdings" ||
    lowercase === "symbol" ||
    lowercase === "times new roman" ||
    lowercase === "courier new" ||
    lowercase === "tahoma" ||
    lowercase === "microsoft yahei" ||
    lowercase === "ms gothic"
  ) {
    return true;
  }

  // Filter out pure hex, GUID or system pointer noise
  if (/^[a-f0-9-]{36}$/.test(lowercase)) return true; // Standard GUID
  if (/^[a-f0-9]{8,128}$/.test(lowercase)) return true; // Noise hex blocks
  if (/^[\s\.\:\,\-\_\|\+\?\!\#\@\$\%\^\&\*\(\)\/\\\=\[\]\{\}]+$/.test(lowercase)) return true; // Pure punctuation
  
  // Ignore very common binary formatting headers
  if (
    lowercase.includes("oneparent") ||
    lowercase.includes("onechildren") ||
    lowercase.includes("oneid") ||
    lowercase.includes("onetoc") ||
    lowercase.includes("onetoc2") ||
    lowercase.includes("aspose") ||
    lowercase.startsWith("http://") ||
    lowercase.startsWith("https://")
  ) {
    return true;
  }

  return false;
}

/**
 * Simple offline/heuristic parser which assembles binary extracted text 
 * into printable pages when the Gemini API is omitted.
 */
function runLocalHeuristicParse(strings: string[], fileName: string): any {
  // Extract sections & organize based on structural patterns
  const pages: any[] = [];
  let currentPage: any = null;
  let currentSection: any = null;

  // Find elements with timestamps
  const dateRegex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)?,?\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s*\d{4}/i;
  const timeRegex = /\d{1,2}:\d{2}\s*(am|pm)/i;

  const titleKeywords = ["notebook", "notes", "todo", "meeting", "lecture", "project", "class", "status", "overview", "agenda", "draft", "report"];

  // Sort short lines or uppercase titles first as potential candidate sheets
  let processedStrings = strings.filter(s => s.length < 500);

  if (processedStrings.length === 0) {
    processedStrings = ["Welcome to your OneNote Project Container", "This notebook sheet represents extracted items loaded locally from the binary.", "Double click to write custom notes directly or download of the sheet."];
  }

  // Iterate over extracted texts and structure them
  for (const s of processedStrings) {
    const isDate = dateRegex.test(s) || timeRegex.test(s);
    const hasSectionMarker = s.startsWith("❖") || s.startsWith("■") || s.startsWith("★") || s.startsWith("Section:");
    const hasTodoMarker = s.startsWith("[ ]") || s.startsWith("[x]") || s.startsWith("[X]") || s.includes("☐") || s.includes("☑");

    if (isDate && currentPage) {
      currentPage.date = s;
      continue;
    }

    // Is it a new page? Short length, capital letter, doesn't contain common noise
    const isPossiblePageTitle = s.length < 60 && !s.includes("[") && !s.includes("]") && (
      titleKeywords.some(kw => s.toLowerCase().includes(kw)) ||
      (s[0] === s[0].toUpperCase() && !s.endsWith(".") && !s.endsWith(","))
    );

    if (isPossiblePageTitle && (!currentPage || currentPage.sections.length > 2)) {
      currentPage = {
        title: s,
        date: new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        sections: []
      };
      pages.push(currentPage);
      currentSection = null;
      continue;
    }

    if (!currentPage) {
      currentPage = {
        title: "General Extracted Notes",
        date: new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        sections: []
      };
      pages.push(currentPage);
    }

    // Determine element type
    if (hasTodoMarker) {
      if (!currentSection || currentSection.type !== 'checklist') {
        currentSection = { type: 'checklist', content: [] };
        currentPage.sections.push(currentSection);
      }
      const text = s.replace(/^\[[ xX]?\]\s*/, '').replace(/^[☐☑]\s*/, '');
      const checked = s.includes("[x]") || s.includes("[X]") || s.includes("☑");
      currentSection.content.push({ text, checked });
    } else if (hasSectionMarker || (s.length < 40 && s.endsWith(":"))) {
      currentSection = {
        type: 'paragraph',
        title: s.replace(/^❖|■|★|Section:\s*/g, '').trim(),
        content: []
      };
      currentPage.sections.push(currentSection);
    } else {
      // Standard bullet list or paragraph
      const isBullet = s.startsWith("•") || s.startsWith("-") || s.startsWith("*") || s.startsWith("▪");
      if (isBullet) {
        if (!currentSection || currentSection.type !== 'bullet_list') {
          currentSection = { type: 'bullet_list', content: [] };
          currentPage.sections.push(currentSection);
        }
        currentSection.content.push(s.replace(/^[•\-\*▪]\s*/, ''));
      } else {
        if (!currentSection || currentSection.type !== 'paragraph') {
          currentSection = { type: 'paragraph', content: [] };
          currentPage.sections.push(currentSection);
        }
        currentSection.content.push(s);
      }
    }
  }

  // Ensure every section has non-empty content
  pages.forEach(p => {
    p.sections = p.sections.filter((sec: any) => sec.content && sec.content.length > 0);
    if (p.sections.length === 0) {
      p.sections.push({
        type: 'paragraph',
        title: 'Notebook Excerpt',
        content: ["Parsed elements are ready to export. Adjust font preferences or compliance settings on the sidebar and preview prior to printing."]
      });
    }
  });

  return {
    name: fileName.replace(/\.one$/, ""),
    summary: `Local binary extraction summary of "${fileName}". Discovered ${pages.length} pages, and organized elements sequentially.`,
    pages
  };
}

// POST endpoint for directly uploading and parsing a OneNote file
app.post("/api/convert-one", async (req, res) => {
  const { fileName, fileData } = req.body;

  if (!fileData) {
    return res.status(400).json({ error: "No OneNote file data provided" });
  }

  try {
    console.log(`[Processing] Extracting binary streams for file: ${fileName}`);
    const fileBuffer = Buffer.from(fileData, "base64");
    
    // Extract strings natively
    const extractedStrings = extractOneNoteStrings(fileBuffer);
    console.log(`[Extracted] Found ${extractedStrings.length} printable text objects.`);

    // If Gemini key exists, consult Gemini layout model to clean up and structure
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      console.log(`[Gemini AI] Building intelligent page mappings representing: ${fileName}`);
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const prompt = `
          You are an expert document compilation system. I have loaded a binary Microsoft OneNote (.one) file named "${fileName}" and extracted standard unicode string sequences from its raw streams.
          
          Here are the extracted raw strings in order of occurrence in the binary:
          ---
          ${extractedStrings.slice(0, 180).join("\n")}
          ---
          
          Analyze these string components and re-synthesize them into a highly robust and structured multi-page document model.
          Identify different logical pages. For each page, infer or match:
          - A clear Title (e.g. "Meeting Notes: Core Project Discussion")
          - A timestamp or Date (formatted cleanly, e.g., "Monday, June 1, 2026")
          - Under each page, create organized sections of content. Each section MUST be categorized by type:
            - 'paragraph': a list of generic text paragraphs
            - 'bullet_list': lists of bullet points (each point is a string)
            - 'checklist': task lists where each item has "text" (string) and "checked" (boolean) properties.
            - 'table': simple table configurations with headers and rows.
          
          Please output the results SECURELY as a clean JSON representation. Make sure every single field matches the following responseSchema.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the notebook" },
                summary: { type: Type.STRING, description: "A high-level smart summary of the contents" },
                pages: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      date: { type: Type.STRING },
                      sections: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            type: { type: Type.STRING, description: "Must be: paragraph, bullet_list, checklist, or table" },
                            title: { type: Type.STRING, description: "Optional subtitle or header of this section" },
                            content: {
                              type: Type.ARRAY,
                              items: {
                                type: Type.OBJECT,
                                properties: {
                                  // For paragraph/bullet lists: we can map arrays of strings or structures.
                                  // BUT to keep the schema simple and fully compliant, let's allow checklist items
                                  // or simple text sequences:
                                  text: { type: Type.STRING },
                                  checked: { type: Type.BOOLEAN }
                                }
                              }
                            },
                            // Additional lists as helper
                            textItems: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                            }
                          },
                          required: ["type"]
                        }
                      }
                    },
                    required: ["title"]
                  }
                }
              },
              required: ["name", "pages"]
            }
          }
        });

        if (response.text) {
          const parsedRes = JSON.parse(response.text.trim());
          
          // Re-map Gemini response to consistent client types
          const formattedPages = parsedRes.pages.map((p: any) => ({
            title: p.title || "Untitled Page",
            date: p.date || new Date().toDateString(),
            sections: (p.sections || []).map((s: any) => {
              if (s.type === 'checklist') {
                return {
                  type: 'checklist',
                  title: s.title,
                  content: (s.content || []).map((item: any) => ({
                    text: item.text || "Task item",
                    checked: !!item.checked
                  }))
                };
              } else if (s.type === 'bullet_list') {
                return {
                  type: 'bullet_list',
                  title: s.title,
                  content: s.textItems || (s.content || []).map((item: any) => item.text || String(item))
                };
              } else {
                return {
                  type: 'paragraph',
                  title: s.title,
                  content: s.textItems || (s.content || []).map((item: any) => item.text || String(item))
                };
              }
            })
          }));

          return res.json({
            name: parsedRes.name || fileName.replace(/\.one$/, ""),
            summary: parsedRes.summary || `Extracted notebooks sections via Gemini Flash layout intelligence.`,
            pages: formattedPages,
            engine: "Gemini AI Compiler"
          });
        }
      } catch (gemError) {
        console.error("Gemini parse failed, falling back to local extractor:", gemError);
      }
    }

    // Local extraction fallback
    const heuristicResults = runLocalHeuristicParse(extractedStrings, fileName);
    return res.json({
      ...heuristicResults,
      engine: "Local Stream Extractor"
    });

  } catch (error: any) {
    console.error("Error loading OneNote file stream:", error);
    res.status(500).json({ error: "Failed to read binary contents: " + error.message });
  }
});

// Vite server development mapping
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack Application running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
