/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Award, Type, Package, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  icon: any;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "How do I load a commercial or free trial license?",
      icon: Award,
      answer: (
        <div className="space-y-2 text-slate-600 text-xs">
          <p>
            By default, running Aspose.Note without configuration runs in <strong>Evaluation mode</strong>. It outputs a red watermark banner at the top of converted pages, and limits layout page scans.
          </p>
          <p>
            To activate a trial or purchased license (usually a <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.lic</code> file), place the file into your classpath and initialize it <strong>before</strong> loading the OneNote document:
          </p>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[10px] space-y-1 select-all leading-normal">
            <div>import com.aspose.note.License;</div>
            <div className="text-slate-500">// Initialize once on application startup</div>
            <div>License license = new License();</div>
            <div>license.setLicense("Aspose.Note.lic");</div>
          </div>
        </div>
      ),
    },
    {
      question: "Why do some converted PDFs have blank circles, missing symbols, or layout alignment shifts?",
      icon: Type,
      answer: (
        <div className="space-y-2 text-slate-600 text-xs text-justify">
          <p>
            OneNote uses specialized windows fonts (like <em>Calibri</em>, <em>Segoe UI</em>, and ink shapes) to draw elements. If your script runs on a <strong>headless Linux server</strong> (like Docker or AWS Lambda), those MS font libraries won't exist naturally, resulting in rectangular boxes or blank circles.
          </p>
          <p>
            <strong>The fix:</strong> Install the Microsoft fonts package on Linux, or download the TTF files to a local directory in your project folder, and map it using our font folder option in Java:
          </p>
          <div className="bg-slate-900 text-slate-300 rounded-lg p-3 font-mono text-[10px] select-all leading-normal">
            <div>saveOptions.setFontFolder("/usr/share/fonts/truetype/msttcorefonts");</div>
          </div>
        </div>
      ),
    },
    {
      question: "Can I convert large password-secured/encrypted OneNote files?",
      icon: ShieldCheck,
      answer: (
        <div className="space-y-2 text-slate-600 text-xs">
          <p>
            Yes! Standard password protection encrypts OneNote data sections with AES hashing. 
            The generated code provides an opt-in block using <code className="bg-slate-100 px-1 rounded font-mono">LoadOptions</code>. By simply passing the decryption key into <code className="bg-slate-100 px-1 rounded font-mono">loadOptions.setPassword("my_key")</code>, Aspose.Note parses and decrypts files automatically without throwing a security exception.
          </p>
        </div>
      ),
    },
    {
      question: "Which build system should I choose: Maven, Gradle, or Standalone?",
      icon: Package,
      answer: (
        <div className="space-y-2 text-slate-600 text-xs">
          <p>
            <strong>Maven</strong> is the industry standard for general Java applications. It cleanly downloads external dependencies through a readable XML file and works seamlessly on almost any CI/CD environment.
          </p>
          <p>
            <strong>Gradle</strong> uses code-based configurations, compiles much faster through dynamic caching and deamons, and is perfect if you are integrating this script with Android or modern Kotlin backends.
          </p>
          <p>
            We highly recommend using Maven or Gradle over Standalone because they automatically download second-level transitive dependencies, sparing you from manual jar search sessions.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
        <h3 className="font-heading font-semibold text-slate-800 text-sm">Converting FAQ & Best Practices</h3>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, index) => {
          const IsOpen = openIndex === index;
          const FaqIcon = faq.icon;
          return (
            <div
              key={index}
              className={`border rounded-lg transition-all ${
                IsOpen ? 'border-indigo-150 bg-indigo-50/10' : 'border-slate-150 hover:bg-slate-50/50'
              }`}
            >
              <button
                id={`btn-faq-question-${index}`}
                onClick={() => setOpenIndex(IsOpen ? null : index)}
                className="w-full text-left px-4 py-3.5 flex items-center justify-between font-sans text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="p-1 rounded bg-slate-100 text-slate-500 group-hover:bg-slate-200">
                    <FaqIcon className="h-3.5 w-3.5 text-slate-600" />
                  </span>
                  <span>{faq.question}</span>
                </div>
                {IsOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>

              {IsOpen && (
                <div className="px-5 pb-4 pt-1 border-t border-dashed border-slate-100 animate-slide-down">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
