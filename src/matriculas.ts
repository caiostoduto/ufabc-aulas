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

export async function fetchMatriculasAtualURL (matriculasURL: URL): Promise<URL> {
  const matriculasHtml = await fetch(matriculasURL.toString())
  const $ = cheerio.load(matriculasHtml)

  const matriculasElement = $('a:contains("Matrículas deferidas após o ajuste")')
  if (matriculasElement.length === 0) {
    throw new Error('Não foi possível encontrar as matrículas.')
  }

  return new URL(`https://${matriculasURL.host}${matriculasElement.attr('href')}`)
}
