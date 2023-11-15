import { fetch, extractTextsFromPdf } from './utils'
import * as cheerio from 'cheerio'
import RE2 from 're2'

const MONTHS = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'].reverse()

export async function fetchQuadris (calendarioAtualURL: URL): Promise<quadri[]> {
  const txt = (await extractTextsFromPdf({
    url: calendarioAtualURL.toString()
  })).map((txts) => txts.join('')).join('')

  const inicios = findInicios(txt)
  const fins = findFins(txt)

  return inicios.map((val, i) => ({ inicio: val, fim: fins[i] }))
}

function findFins (txt: string): Date[] {
  const re = RE2(/(\d\d?) Conclusão do \dº quadrimestre de 202\d/gi)
  const matches = Array.from(txt.matchAll(re))
  if (matches.length !== 3) {
    throw new Error('Não foi possível encontrar os fins das aulas.')
  }

  const dates: Date[] = []
  let lastIndex = 0
  let months = [...MONTHS]

  matches.forEach((match) => {
    const month = findMonth(txt.slice(lastIndex, match.index as number), months)

    const date = new Date()
    date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    date.setHours(0, 0, 0, 0)
    date.setDate(parseInt(match[1]))
    date.setMonth(11 - month)

    dates.push(date)

    lastIndex = match.index as number
    months = months.slice(0, month)
  })

  return dates
}

function findInicios (txt: string): Date[] {
  const re = RE2(/(\d\d?) Início das Aulas/gi)
  const matches = Array.from(txt.matchAll(re))
  if (matches.length !== 3) {
    throw new Error('Não foi possível encontrar os inícios das aulas.')
  }

  const dates: Date[] = []
  let lastIndex = 0
  let months = [...MONTHS]

  matches.forEach((match) => {
    const month = findMonth(txt.slice(lastIndex, match.index as number), months)

    const date = new Date()
    date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    date.setHours(0, 0, 0, 0)
    date.setDate(parseInt(match[1]))
    date.setMonth(11 - month)

    dates.push(date)

    lastIndex = match.index as number
    months = months.slice(0, month)
  })

  return dates
}

function findMonth (txt: string, months: string[]): number {
  for (const month of months) {
    const re = RE2(month, 'g')
    const match = txt.match(re)

    if (match !== null) {
      return months.indexOf(month)
    }
  }

  throw new Error('Não foi possível encontrar o mês.')
}

export async function fetchCalendarioAtualURL (calendariosURL: URL): Promise<URL> {
  const calendaiosHtml = await fetch(calendariosURL.toString())
  const $ = cheerio.load(calendaiosHtml)

  const calendarioElement = $('a:contains("Calendário de procedimentos administrativo-acadêmicos")')
  if (calendarioElement.length === 0) {
    throw new Error('Não foi possível encontrar o calendário.')
  }

  return new URL(`https://${calendariosURL.host}${calendarioElement.attr('href')}`)
}

export interface quadri {
  inicio: Date
  fim: Date
}
