export const categoryColors = [
  { bg: 'var(--ds-category-blue-bg)', text: 'var(--ds-category-blue-text)' },
  { bg: 'var(--ds-category-orange-bg)', text: 'var(--ds-category-orange-text)' },
  { bg: 'var(--ds-category-green-bg)', text: 'var(--ds-category-green-text)' },
  { bg: 'var(--ds-category-purple-bg)', text: 'var(--ds-category-purple-text)' },
  { bg: 'var(--ds-category-pink-bg)', text: 'var(--ds-category-pink-text)' },
  { bg: 'var(--ds-category-teal-bg)', text: 'var(--ds-category-teal-text)' },
];

// Cache to ensure consistent color assignment
const categoryColorMap = new Map<string, number>();
let colorIndex = 0;

export function getCategoryColor(category: string): { bg: string; text: string } {
  // Normalize category name for consistent mapping
  const normalizedCategory = category.toLowerCase().trim();
  
  // If we've seen this category before, return the same color
  if (categoryColorMap.has(normalizedCategory)) {
    const index = categoryColorMap.get(normalizedCategory)!;
    return categoryColors[index];
  }
  
  // Assign a new color and cycle through available colors
  const assignedIndex = colorIndex % categoryColors.length;
  categoryColorMap.set(normalizedCategory, assignedIndex);
  colorIndex++;
  
  return categoryColors[assignedIndex];
}