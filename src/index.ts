import { fetchCalendarioAtualURL, fetchQuadris, type quadri } from './quadris'

module.exports = class UFABCAulas {
  CALENDARIOS_URL = new URL('https://prograd.ufabc.edu.br/calendarios')
  MATRICULAS_URL = new URL('https://prograd.ufabc.edu.br/matriculas')

  calendarioAtualURL: URL | undefined
  quadris: quadri[] = []

  async fetch (): Promise<UFABCAulas> {
    await this.fetchQuadris()

    return this
  }

  async fetchQuadris (): Promise<UFABCAulas> {
    this.calendarioAtualURL = await fetchCalendarioAtualURL(this.CALENDARIOS_URL)
    this.quadris = await fetchQuadris(this.calendarioAtualURL)

    return this
  }
}
