import { getRecipes, getRecipeTags } from "./api.js"
import { render } from "./render.js"

const app = document.querySelector("#app")

const state = {
  items: [],
  tags: [],
  status: "loading",
  error: null,
  query: "",
  filter: "all",
  sort: "default",
}

async function load() {
  state.status = "loading"
  state.error = null
  render(state)

  try {
    const [recipeData, tags] = await Promise.all([
      getRecipes(),
      getRecipeTags(),
    ])

    state.items = recipeData.recipes
    state.tags = tags
    state.status = "success"
  } catch (error) {
    state.status = "error"
    state.error = error.message
  }

  render(state)
}

app.addEventListener("input", (event) => {
  if (event.target.id !== "recipe-search") return

  const cursorPosition = event.target.selectionStart
  state.query = event.target.value
  render(state)

  const searchInput = document.querySelector("#recipe-search")
  searchInput?.focus()

  if (cursorPosition !== null) {
    searchInput?.setSelectionRange(cursorPosition, cursorPosition)
  }
})

load()