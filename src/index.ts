import { fetchQuadris, type quadri } from './quadris'
import { fetchMatriculas } from './matriculas'
import { findHref } from './utils'
import { type CheerioAPI } from 'cheerio'

class UFABCAulas {
  CALENDARIOS_URL = new URL('https://prograd.ufabc.edu.br/calendarios')
  MATRICULAS_URL = new URL('https://prograd.ufabc.edu.br/matriculas')
  ANTERIORES_URL = new URL('https://prograd.ufabc.edu.br/matriculas/arquivo')

  calendarioPdfURL: URL | undefined
  matriculasPdfURL: URL | undefined
  $matriculas: CheerioAPI | undefined

  quadris: quadri[] | undefined
  matriculas: Map<string, string[]> | undefined

  async fetch (): Promise<UFABCAulas> {
    await this.fetchQuadris()
    await this.fetchMatriculas()

    return this
  }

  async fetchQuadris (): Promise<UFABCAulas> {
    try {
      this.calendarioPdfURL = (await findHref(
        this.CALENDARIOS_URL,
        'Calendário de procedimentos administrativo-acadêmicos'
      ))[1]
    } catch (e) {
      throw new Error('Não foi possível encontrar o calendário.')
    }

    this.quadris = await fetchQuadris(this.calendarioPdfURL)

    return this
  }

  async fetchMatriculas (): Promise<UFABCAulas> {
    this.matriculasPdfURL = await this.fetchHrefMatriculas(
      'Matrículas deferidas após o ajuste')

    this.matriculas = await fetchMatriculas(this.matriculasPdfURL)

    return this
  }

  private async fetchHrefMatriculas (contains: string): Promise<URL> {
    let res
    try {
      res = await findHref(
        this.MATRICULAS_URL,
        contains,
        this.$matriculas
      )
    } catch (e) {
      res = await findHref(
        (await findHref(this.ANTERIORES_URL, ' Quadrimestre de '))[1],
        contains
      )
    }

    this.$matriculas = res[0]
    return res[1]
  }
}

export default UFABCAulas
module.exports = UFABCAulas
