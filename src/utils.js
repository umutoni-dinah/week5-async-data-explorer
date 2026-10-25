export function getVisibleItems({ items, query, filter, sort }) {
  const searchTerm = query.trim().toLowerCase()

  const filteredItems = items
    .filter(({ name, cuisine, ingredients = [] }) => {
      const searchableText = [
        name,
        cuisine,
        ...ingredients,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(searchTerm)
    })
    .filter(({ cuisine }) => {
      return filter === "all" || cuisine === filter
    })

  const sorters = {
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "rating-desc": (a, b) => b.rating - a.rating,
    "prep-asc": (a, b) => a.prepTimeMinutes - b.prepTimeMinutes,
  }

  return sorters[sort]
    ? filteredItems.toSorted(sorters[sort])
    : filteredItems
}