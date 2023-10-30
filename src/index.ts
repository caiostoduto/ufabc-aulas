import { fetchMatriculasAtualURL, fetchMatriculas } from './matriculas'
import { fetchCalendarioAtualURL, fetchQuadris, type quadri } from './quadris'

module.exports = class UFABCAulas {
  CALENDARIOS_URL = new URL('https://prograd.ufabc.edu.br/calendarios')
  MATRICULAS_URL = new URL('https://prograd.ufabc.edu.br/matriculas')

  calendarioAtualURL: URL | undefined
  matriculasAtualURL: URL | undefined
  quadris: quadri[] | undefined
  matriculas: Map<string, string[]> | undefined
  turmas: Map<string, string[]> | undefined

  async fetch (): Promise<UFABCAulas> {
    await this.fetchQuadris()
    await this.fetchMatriculas()

    return this
  }

  async fetchQuadris (): Promise<UFABCAulas> {
    this.calendarioAtualURL = await fetchCalendarioAtualURL(this.CALENDARIOS_URL)
    this.quadris = await fetchQuadris(this.calendarioAtualURL)

    return this
  }

  async fetchMatriculas (): Promise<UFABCAulas> {
    this.matriculasAtualURL = await fetchMatriculasAtualURL(this.MATRICULAS_URL)
    this.matriculas = await fetchMatriculas(this.matriculasAtualURL)

    return this
  }
}
