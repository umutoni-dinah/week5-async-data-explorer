const app = document.querySelector("#app")

export function render(state) {
  app.replaceChildren()

  const page = document.createElement("main")
  page.className = "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"

  const heading = document.createElement("h1")
  heading.textContent = "Recipe Explorer"
  heading.className = "text-3xl font-bold tracking-tight text-gray-900"

  const status = document.createElement("p")
  status.setAttribute("aria-live", "polite")
  status.className = "mt-3 text-gray-600"

  if (state.status === "loading") {
    status.textContent = "Loading recipes…"
    page.append(heading, status)
    app.append(page)
    return
  }

  if (state.status === "error") {
    status.textContent = `Could not load recipes: ${state.error}`
    page.append(heading, status)
    app.append(page)
    return
  }

  status.textContent = `${state.items.length} recipes loaded`

  const grid = document.createElement("section")
  grid.setAttribute("aria-label", "Recipes")
  grid.className = "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"

  const cards = state.items.map(({ name, image, cuisine, difficulty, rating }) => {
    const card = document.createElement("article")
    card.className = "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"

    const photo = document.createElement("img")
    photo.src = image
    photo.alt = name
    photo.className = "h-48 w-full object-cover"

    const content = document.createElement("div")
    content.className = "space-y-2 p-4"

    const title = document.createElement("h2")
    title.textContent = name
    title.className = "text-lg font-semibold text-gray-900"

    const description = document.createElement("p")
    description.textContent = `${cuisine} · ${difficulty} · ★ ${rating}`
    description.className = "text-sm text-gray-600"

    content.append(title, description)
    card.append(photo, content)

    return card
  })

  grid.append(...cards)
  page.append(heading, status, grid)
  app.append(page)
}