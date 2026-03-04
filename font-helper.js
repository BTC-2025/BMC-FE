#!/usr/bin/env node

/**
 * Font Class Helper Script
 *
 * This script helps you quickly identify which font class to use
 * for different text elements in your React components.
 */

const fontGuide = {
  headings: {
    className: "font-heading",
    description: "Arial Rounded MT Bold - For main page titles, large numbers",
    examples: [
      '<h1 className="font-heading text-4xl font-black">Main Title</h1>',
      '<h2 className="font-heading text-3xl font-black">Page Title</h2>',
      '<p className="font-heading text-3xl font-black">{metricValue}</p>',
    ],
    useFor: [
      "Page titles (h1, h2)",
      "Large metric numbers",
      "Primary card headings",
      "Hero text",
    ],
  },

  subheadings: {
    className: "font-subheading",
    description: "Roboto - For section titles, table headers, card sub-titles",
    examples: [
      '<h3 className="font-subheading font-bold text-xl">Section Title</h3>',
      '<h4 className="font-subheading font-bold">Card Title</h4>',
      '<th className="font-subheading text-[10px] font-bold">Column</th>',
      '<label className="font-subheading text-[10px] font-bold">Label</label>',
    ],
    useFor: [
      "Section headings (h3, h4)",
      "Table column headers",
      "Card section titles",
      "Modal titles",
      "Form labels",
    ],
  },

  body: {
    className: "font-body",
    description: "Arial - For paragraphs, descriptions, labels, table data",
    examples: [
      '<p className="font-body text-sm font-normal">Description text</p>',
      '<td className="font-body px-6 py-4 font-semibold">{data}</td>',
      '<span className="font-body text-xs">{metadata}</span>',
      '<input className="font-body text-sm font-semibold" />',
    ],
    useFor: [
      "Paragraphs and descriptions",
      "Table cell content",
      "Form input text",
      "Button text",
      "Small metadata text",
      "Labels and tags",
    ],
  },
};

console.log("\n╔═══════════════════════════════════════════════════════════╗");
console.log("║         ERP FONT SYSTEM - QUICK REFERENCE GUIDE          ║");
console.log("╚═══════════════════════════════════════════════════════════╝\n");

Object.entries(fontGuide).forEach(([key, value]) => {
  console.log(`\n━━━ ${key.toUpperCase()} ━━━`);
  console.log(`Class: ${value.className}`);
  console.log(`Font: ${value.description}\n`);

  console.log("Use for:");
  value.useFor.forEach((use) => console.log(`  • ${use}`));

  console.log("\nExamples:");
  value.examples.forEach((example) => console.log(`  ${example}`));
  console.log("");
});

console.log("\n━━━ FONT WEIGHT QUICK REFERENCE ━━━\n");
console.log("font-black    → 900 (Headings, emphasis)");
console.log("font-bold     → 700 (Sub-headings, important text)");
console.log("font-semibold → 600 (Semi-emphasized body text)");
console.log("font-medium   → 500 (Standard body text)");
console.log("font-normal   → 400 (Light body text)");

console.log("\n━━━ COMMON PATTERNS ━━━\n");

const patterns = {
  "Page Header": `
<div>
  <h2 className="font-heading text-3xl font-black text-[#111827]">
    Page Title
  </h2>
  <p className="font-body text-sm font-normal text-gray-500">
    Description
  </p>
</div>`,

  "Card with Metric": `
<div className="bg-white p-8 rounded-[40px]">
  <p className="font-heading text-3xl font-black text-[#111827]">
    {value}
  </p>
  <p className="font-body text-[10px] font-black text-[#9CA3AF] uppercase">
    {label}
  </p>
</div>`,

  "Table Structure": `
<thead>
  <tr>
    <th className="font-subheading px-6 py-4 text-[10px] font-bold">
      Column Name
    </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td className="font-body px-6 py-4 font-semibold">
      {cellData}
    </td>
  </tr>
</tbody>`,

  "Form Field": `
<div>
  <label className="font-subheading text-[10px] font-bold text-[#9CA3AF] uppercase">
    Field Label
  </label>
  <input className="font-body w-full px-4 py-3 text-sm font-semibold" />
</div>`,
};

Object.entries(patterns).forEach(([name, code]) => {
  console.log(`${name}:${code}\n`);
});

console.log("\n━━━ MIGRATION CHECKLIST ━━━\n");
const checklist = [
  "Replace h1, h2 with font-heading",
  "Replace h3, h4 with font-subheading",
  "Replace p, span, div text with font-body",
  "Update table headers (th) with font-subheading",
  "Update table cells (td) with font-body",
  "Update form labels with font-subheading",
  "Update form inputs with font-body",
  "Adjust font weights appropriately",
  "Test alignment and spacing",
];

checklist.forEach((item, i) => {
  console.log(`  ${i + 1}. [ ] ${item}`);
});

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("📚 For detailed documentation, see: FONT_STYLE_GUIDE.md");
console.log(
  "📋 For implementation summary, see: FONT_IMPLEMENTATION_SUMMARY.md\n"
);
