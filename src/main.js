import { getRecipes, getRecipeTags } from "./api.js"
import { render } from "./render.js"

const state = {
  items: [],
  tags: [],
  status: "loading",
  error: null,
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

load()