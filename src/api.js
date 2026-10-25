const BASE_URL = "https://dummyjson.com"

export async function getJSON(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response.json()
}

export const getRecipes = () => getJSON(`${BASE_URL}/recipes?limit=50`)
export const getRecipeTags = () => getJSON(`${BASE_URL}/recipes/tags`)
export const getRecipe = (id) => getJSON(`${BASE_URL}/recipes/${id}`)