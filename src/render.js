import { getVisibleItems } from "./utils.js";

const app = document.querySelector("#app");

export function render(state) {
  app.replaceChildren();

  const page = document.createElement("main");
  page.className = "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8";

  const heading = document.createElement("h1");
  heading.textContent = "Recipe Explorer";
  heading.className = "text-3xl font-bold tracking-tight text-gray-900";

  const status = document.createElement("p");
  status.setAttribute("aria-live", "polite");
  status.className = "mt-3 text-gray-600";

  if (state.status === "loading") {
    status.textContent = "Loading recipes…";
    page.append(heading, status);
    app.append(page);
    return;
  }

  if (state.status === "error") {
    status.textContent = `Could not load recipes: ${state.error}`;
    page.append(heading, status);
    app.append(page);
    return;
  }

  const searchLabel = document.createElement("label");
  searchLabel.htmlFor = "recipe-search";
  searchLabel.textContent = "Search recipes";
  searchLabel.className = "mt-6 block font-medium text-gray-800";

  const searchInput = document.createElement("input");
  searchInput.id = "recipe-search";
  searchInput.type = "search";
  searchInput.placeholder = "Try a recipe name, cuisine, or ingredient";
  searchInput.value = state.query ?? "";
  searchInput.className =
    "mt-2 w-full rounded-lg border border-gray-300 px-4 py-3";

  const filterLabel = document.createElement("label");
  filterLabel.htmlFor = "cuisine-filter";
  filterLabel.textContent = "Filter by cuisine";
  filterLabel.className = "mt-4 block font-medium text-gray-800";

  const filterSelect = document.createElement("select");
  filterSelect.id = "cuisine-filter";
  filterSelect.className =
    "mt-2 rounded-lg border border-gray-300 bg-white px-4 py-3";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All cuisines";
  filterSelect.append(allOption);

  const cuisines = [
    ...new Set(state.items.map(({ cuisine }) => cuisine).filter(Boolean)),
  ].toSorted();

  cuisines.forEach((cuisine) => {
    const option = document.createElement("option");
    option.value = cuisine;
    option.textContent = cuisine;
    filterSelect.append(option);
  });

  filterSelect.value = state.filter ?? "all";

  const sortLabel = document.createElement("label");
  sortLabel.htmlFor = "sort-select";
  sortLabel.textContent = "Sort recipes";
  sortLabel.className = "mt-4 block font-medium text-gray-800";

  const sortSelect = document.createElement("select");
  sortSelect.id = "sort-select";
  sortSelect.className =
    "mt-2 rounded-lg border border-gray-300 bg-white px-4 py-3";

  const sortOptions = [
    { value: "default", label: "Recommended" },
    { value: "name-asc", label: "Name: A–Z" },
    { value: "rating-desc", label: "Highest rated" },
    { value: "prep-asc", label: "Quickest prep" },
  ];

  sortOptions.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    sortSelect.append(option);
  });

  sortSelect.value = state.sort ?? "default";
  const visibleItems = getVisibleItems({
    items: state.items,
    query: state.query ?? "",
    filter: state.filter ?? "all",
    sort: state.sort ?? "default",
  });

    const totals = visibleItems.reduce(
    (
      totals,
      {
        rating = 0,
        prepTimeMinutes = 0,
        cookTimeMinutes = 0,
      },
    ) => ({
      ratingSum: totals.ratingSum + rating,
      minutesSum:
        totals.minutesSum + prepTimeMinutes + cookTimeMinutes,
    }),
    { ratingSum: 0, minutesSum: 0 },
  )

  const averageRating =
    visibleItems.length > 0
      ? (totals.ratingSum / visibleItems.length).toFixed(1)
      : "—"

  const averageTime =
    visibleItems.length > 0
      ? Math.round(totals.minutesSum / visibleItems.length)
      : "—"

  const statsBar = document.createElement("section")
  statsBar.setAttribute("aria-label", "Recipe statistics")
  statsBar.className =
    "mt-6 flex flex-wrap gap-4 rounded-xl bg-amber-50 p-4 text-sm text-gray-800"

  const statMessages = [
    `${visibleItems.length} recipes shown`,
    `Average rating: ${averageRating}`,
    `Average prep + cook time: ${averageTime} min`,
  ]

  statMessages.forEach((message) => {
    const stat = document.createElement("p")
    stat.textContent = message
    statsBar.append(stat)
  })
  status.textContent = `${visibleItems.length} recipes shown`;

  const grid = document.createElement("section");
  grid.setAttribute("aria-label", "Recipes");
  grid.className = "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  if (visibleItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent =
      "No recipes match your search. Try another term.";
    emptyMessage.className = "mt-8 text-gray-600";
    page.append(
      heading,
      searchLabel,
      searchInput,
      filterLabel,
      filterSelect,
      sortLabel,
      sortSelect,
      filterSelect,
      statsBar,
      status,
      emptyMessage,
    );
    app.append(page);
    return;
  }

  const cards = visibleItems.map(
    ({ name, image, cuisine, difficulty, rating }) => {
      const card = document.createElement("article");
      card.className =
        "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

      const photo = document.createElement("img");
      photo.src = image;
      photo.alt = name;
      photo.className = "h-48 w-full object-cover";

      const content = document.createElement("div");
      content.className = "space-y-2 p-4";

      const title = document.createElement("h2");
      title.textContent = name;
      title.className = "text-lg font-semibold text-gray-900";

      const description = document.createElement("p");
      description.textContent = `${cuisine} · ${difficulty} · ★ ${rating}`;
      description.className = "text-sm text-gray-600";

      content.append(title, description);
      card.append(photo, content);

      return card;
    },
  );

  grid.append(...cards);
  page.append(
    heading,
    searchLabel,
    searchInput,
    filterLabel,
    filterSelect,
    sortLabel,
    sortSelect,
    filterSelect,
    statsBar,
    status,
    grid,
  );
  app.append(page);
}
