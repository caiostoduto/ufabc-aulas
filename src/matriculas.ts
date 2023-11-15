import { fetch, extractTextsFromPdf } from './utils'
import * as cheerio from 'cheerio'

export async function fetchMatriculas (matriculasAtualURL: URL): Promise<Map<string, string[]>> {
  const matriculas = new Map<string, string[]>()

  const txt = (await extractTextsFromPdf({
    url: matriculasAtualURL.toString(),
    verbosity: 0
  })).map((txts) =>
    txts.filter((t) => t !== '' && t !== ' ')
      .slice(5, -1)
  ).reduce((acc, curr) => acc.concat(curr), [])

  for (let i = 0; i < txt.length / 3; i++) {
    const [matricula, codigo] = txt.slice(i * 3, i * 3 + 2)
    matriculas.set(matricula, (matriculas.get(matricula) ?? []).concat(codigo))
  }

  return matriculas
}

export async function fetchMatriculaURL (matriculasURL: URL, anterioresURL: URL): Promise<URL> {
  try {
    return await _fetchMatriculaURL(matriculasURL)
  } catch (e) {
    return await _fetchMatriculaURL(await fetchLatestMatricula(anterioresURL))
  }
}

async function _fetchMatriculaURL (matriculasURL: URL): Promise<URL> {
  const matriculasHtml = await fetch(matriculasURL.toString())
  const $ = cheerio.load(matriculasHtml)

  const matriculasElements = $('a:contains("Matrículas deferidas após o ajuste")')
  if (matriculasElements.length === 0) {
    throw new Error('Não foi possível encontrar as matrículas.')
  }

  return new URL(`https://${matriculasURL.host}${matriculasElements.attr('href')}`)
}

async function fetchLatestMatricula (anterioresURL: URL): Promise<URL> {
  const anterioresHtml = await fetch(anterioresURL.toString())
  const $ = cheerio.load(anterioresHtml)
  const anterioresElements = $('a:contains(" Quadrimestre de ")')

  if (anterioresElements.length === 0) {
    throw new Error('Não foi possível encontrar as matrículas anteriores.')
  }

  return new URL(`https://${anterioresURL.host}${anterioresElements.attr('href')}`)
}
