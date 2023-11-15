import { fetchQuadris, type quadri } from './quadris'
import { fetchMatriculas } from './matriculas'
import { fetch$Matriculas, findHref } from './utils'
import { type CheerioAPI } from 'cheerio'

class UFABCAulas {
  CALENDARIOS_URL = new URL('https://prograd.ufabc.edu.br/calendarios')
  MATRICULAS_URL = new URL('https://prograd.ufabc.edu.br/matriculas')
  ANTERIORES_URL = new URL('https://prograd.ufabc.edu.br/matriculas/arquivo')

  calendarioPdfURL: URL | undefined
  matriculasPdfURL: URL | undefined
  turmasAtualURL: URL | undefined
  quadris: quadri[] | undefined
  matriculas: Map<string, string[]> | undefined

  async fetch (): Promise<UFABCAulas> {
    const $ = await fetch$Matriculas(this.MATRICULAS_URL, this.ANTERIORES_URL)

    await this.fetchQuadris()
    await this.fetchMatriculas($)

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

  async fetchMatriculas ($?: CheerioAPI): Promise<UFABCAulas> {
    if ($ === undefined) {
      $ = await fetch$Matriculas(
        this.MATRICULAS_URL, this.ANTERIORES_URL
      )
    }

    const elements = $('a:contains("Matrículas deferidas após o ajuste")')
    if (elements.length === 0) {
      throw new Error('Não foi possível encontrar as matrículas.')
    }

    this.matriculasPdfURL = new URL(
      `https://${this.MATRICULAS_URL.host}${elements.attr('href') as string}`)

    this.matriculas = await fetchMatriculas(this.matriculasPdfURL)

    return this
  }
}

export default UFABCAulas
module.exports = UFABCAulas
