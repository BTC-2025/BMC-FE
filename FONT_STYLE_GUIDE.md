# Font Style Guide - ERP Application

## Overview

This document outlines the typography system for the ERP application with three distinct font families for different text hierarchies.

## Font Families

### 1. **Headings** - Arial Rounded MT Bold

- **Usage**: Main page titles (h1, h2), large numbers, primary headings
- **CSS Class**: `font-heading`
- **CSS Variable**: `var(--font-heading)`
- **Characteristics**: Rounded, bold, attention-grabbing
- **Examples**:
  - Page titles: "People Intelligence", "Sales Orders"
  - Large metric numbers: "245", "1,234"
  - Primary card headings

### 2. **Sub-headings** - Roboto

- **Usage**: Section titles (h3, h4), table headers, card sub-titles
- **CSS Class**: `font-subheading`
- **CSS Variable**: `var(--font-subheading)`
- **Characteristics**: Clean, professional, modern
- **Examples**:
  - Section headings: "Live Attendance Stream", "Hiring Velocity"
  - Table column headers
  - Card section titles
  - Modal titles

### 3. **Body Text** - Arial

- **Usage**: Paragraphs, descriptions, labels, table data
- **CSS Class**: `font-body`
- **CSS Variable**: `var(--font-body)`
- **Characteristics**: Readable, standard, professional
- **Examples**:
  - Descriptive text
  - Form labels
  - Table cell content
  - Button text (sometimes)
  - Small metadata text

## Implementation Examples

### Main Page Heading

```jsx
<h2 className="font-heading text-4xl font-black text-[#111827] tracking-tight">
  Sales Orders
</h2>
```

### Section Sub-heading

```jsx
<h3 className="font-subheading font-bold text-[#111827] text-xl tracking-tight">
  Live Attendance Stream
</h3>
```

### Body Text / Description

```jsx
<p className="font-body text-sm font-normal text-gray-500">
  Manage and track planned outgoing stock to customers.
</p>
```

### Table Headers

```jsx
<th className="font-subheading px-8 py-5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em]">
  Employee
</th>
```

### Table Body Text

```jsx
<p className="font-body text-[14px] font-bold text-[#1E293B]">
  {employee.name}
</p>
```

### Card Numbers/Metrics

```jsx
<p className="font-heading text-3xl font-black text-[#111827] mb-2">
  {card.value}
</p>
```

### Card Labels

```jsx
<p className="font-body text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
  {card.label}
</p>
```

## Font Weight Guidelines

### For Headings (Arial Rounded)

- Use `font-black` (900) for maximum impact
- Use `font-bold` (700) for less prominent headings

### For Sub-headings (Roboto)

- Use `font-bold` (700) for primary sub-headings
- Use `font-semibold` (600) for secondary sub-headings
- Use `font-medium` (500) for tertiary sub-headings

### For Body Text (Arial)

- Use `font-bold` (700) for emphasized body text
- Use `font-semibold` (600) for semi-emphasized text
- Use `font-medium` (500) for standard body text
- Use `font-normal` (400) for light body text

## Text Alignment Best Practices

1. **Consistent Alignment**: Ensure all text within a container follows the same alignment
2. **Left-align by default**: Most content should be left-aligned for readability
3. **Center-align sparingly**: Only for hero sections or empty states
4. **Right-align for numbers**: Especially in tables for better comparison

## Common Patterns

### Page Header Pattern

```jsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h2 className="font-heading text-3xl font-black text-[#111827] tracking-tight">
      Page Title
    </h2>
    <p className="font-body text-sm font-normal text-gray-500">
      Page description goes here.
    </p>
  </div>
</div>
```

### Card Pattern

```jsx
<div className="bg-white p-8 rounded-[40px]">
  <p className="font-heading text-3xl font-black text-[#111827] mb-2">
    {value}
  </p>
  <p className="font-body text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
    {label}
  </p>
</div>
```

### Modal Header Pattern

```jsx
<div className="p-8 border-b border-gray-100">
  <h2 className="font-heading text-2xl font-black text-[#111827] tracking-tight">
    Modal Title
  </h2>
</div>
```

### Form Label Pattern

```jsx
<label className="font-subheading text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block mb-1">
  Field Label
</label>
```

## Migration Checklist

When updating a component, ensure:

- [ ] All h1, h2 tags use `font-heading`
- [ ] All h3, h4 tags use `font-subheading`
- [ ] All p, span, div text content uses `font-body`
- [ ] Table headers use `font-subheading`
- [ ] Table body text uses `font-body`
- [ ] Large numbers/metrics use `font-heading`
- [ ] Labels and descriptions use `font-body`
- [ ] Text alignment is consistent within containers
- [ ] Font weights are appropriate for hierarchy

## Quick Reference

| Element Type           | Font Family | Typical Weight | Example Class                           |
| ---------------------- | ----------- | -------------- | --------------------------------------- |
| Page Title (h1, h2)    | Heading     | black (900)    | `font-heading text-4xl font-black`      |
| Section Title (h3, h4) | Sub-heading | bold (700)     | `font-subheading text-xl font-bold`     |
| Table Header           | Sub-heading | bold (700)     | `font-subheading text-[10px] font-bold` |
| Body Text              | Body        | normal (400)   | `font-body text-sm font-normal`         |
| Emphasized Text        | Body        | bold (700)     | `font-body text-sm font-bold`           |
| Labels                 | Body        | medium (500)   | `font-body text-[10px] font-medium`     |
| Large Numbers          | Heading     | black (900)    | `font-heading text-3xl font-black`      |
| Button Text            | Body        | black (900)    | `font-body text-xs font-black`          |

## Notes

- The `@theme` CSS warning can be ignored - it's a Tailwind CSS v4 feature that works correctly
- Always test font rendering across different browsers
- Ensure proper fallback fonts are maintained in the CSS
- Keep tracking and letter-spacing consistent with design system
