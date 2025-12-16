export const categoryColors = [
  { bg: 'var(--ds-category-blue-bg)', text: 'var(--ds-category-blue-text)' },
  { bg: 'var(--ds-category-orange-bg)', text: 'var(--ds-category-orange-text)' },
  { bg: 'var(--ds-category-green-bg)', text: 'var(--ds-category-green-text)' },
  { bg: 'var(--ds-category-purple-bg)', text: 'var(--ds-category-purple-text)' },
  { bg: 'var(--ds-category-pink-bg)', text: 'var(--ds-category-pink-text)' },
  { bg: 'var(--ds-category-teal-bg)', text: 'var(--ds-category-teal-text)' },
];

// Cache to ensure consistent and unique color assignment
const categoryColorMap = new Map<string, number>();
const knownCategories: string[] = [];

export function getCategoryColor(category: string): { bg: string; text: string } {
  // Normalize category name for consistent mapping
  const normalizedCategory = category.toLowerCase().trim();

  // If we've seen this category before, return the cached color
  if (categoryColorMap.has(normalizedCategory)) {
    const index = categoryColorMap.get(normalizedCategory)!;
    return categoryColors[index];
  }

  // Add new category and sort the list to maintain consistent ordering
  knownCategories.push(normalizedCategory);
  knownCategories.sort();

  // Reassign colors based on sorted order to ensure consistency
  categoryColorMap.clear();
  knownCategories.forEach((cat, idx) => {
    categoryColorMap.set(cat, idx % categoryColors.length);
  });

  // Return the color for this category
  const index = categoryColorMap.get(normalizedCategory)!;
  return categoryColors[index];
}