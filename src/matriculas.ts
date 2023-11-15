import { extractTextsFromPdf } from './utils'

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
