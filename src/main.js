import { getRecipes, getRecipeTags, getRecipe } from "./api.js";
import { render } from "./render.js";

const app = document.querySelector("#app");

const state = {
  items: [],
  tags: [],
  status: "loading",
  error: null,
  query: "",
  filter: "all",
  sort: "default",
  selectedRecipe: null,
  detailStatus: null,
  detailError: null,
};

async function load() {
  state.status = "loading";
  state.error = null;
  render(state);

  try {
    const [recipeData, tags] = await Promise.all([
      getRecipes(),
      getRecipeTags(),
    ]);

    state.items = recipeData.recipes;
    state.tags = tags;
    state.status = "success";
  } catch (error) {
    state.status = "error";
    state.error = error.message;
  }

  render(state);
}

app.addEventListener("input", (event) => {
  if (event.target.id !== "recipe-search") return;

  const cursorPosition = event.target.selectionStart;
  state.query = event.target.value;
  render(state);

  const searchInput = document.querySelector("#recipe-search");
  searchInput?.focus();

  if (cursorPosition !== null) {
    searchInput?.setSelectionRange(cursorPosition, cursorPosition);
  }
});

app.addEventListener("change", (event) => {
  if (event.target.id !== "cuisine-filter") return;

  state.filter = event.target.value;
  render(state);
});

app.addEventListener("change", (event) => {
  if (event.target.id !== "sort-select") return;

  state.sort = event.target.value;
  render(state);
});

app.addEventListener("click", async (event) => {
    if (event.target.closest("#retry-button")) {
    load()
    return
  }

  if (event.target.closest("#reset-filters")) {
  state.query = ""
  state.filter = "all"
  state.sort = "default"
  render(state)
  return
}

  const recipeButton = event.target.closest("[data-recipe-id]")
  if (!recipeButton) return
const recipeId = Number(recipeButton.dataset.recipeId)
const recipeSummary = state.items.find(({ id }) => id === recipeId)
if (!recipeSummary) return

  state.selectedRecipe = recipeSummary
  state.detailError = null
  state.detailStatus = "loading"
  render(state)

  try {
    state.selectedRecipe = await getRecipe(recipeId)
    state.detailStatus = "success"
  } catch (error) {
    state.detailError = error.message
    state.detailStatus = "error"
  }

  render(state)
})
load();
