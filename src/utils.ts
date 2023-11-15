import axios, { type AxiosRequestConfig } from 'axios'
import { getDocument } from 'pdfjs-dist'
import { type DocumentInitParameters, type TextItem } from 'pdfjs-dist/types/src/display/api'
import { type CheerioAPI, load } from 'cheerio'

export async function fetch (url: string, config: AxiosRequestConfig = {}): Promise<any> {
  const res = await axios.get(url, config)
  if (res.status !== 200) {
    throw new Error('Não foi possível acessar o site da UFABC')
  }

  return res.data
}

export async function extractTextsFromPdf (docParams: DocumentInitParameters): Promise<string[][]> {
  const pdf = await getDocument(docParams).promise

  const txts: string[][] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    txts.push((await (await pdf.getPage(i)).getTextContent())
      .items.map((item) => (item as TextItem).str))
  }

  return txts
}

export async function findHref (url: URL, contains: string): Promise<[CheerioAPI, URL]> {
  const html = await fetch(url.toString())
  const $ = load(html)
  const elements = $(`a:contains("${contains}")`)
  if (elements.length === 0) {
    throw new Error()
  } else {
    return [$, new URL(`https://${url.host}${elements.attr('href') as string}`)]
  }
}

export async function fetch$Matriculas (atual: URL, anteriores: URL): Promise<CheerioAPI> {
  try {
    return (await findHref(
      atual, 'Matrículas deferidas após o ajuste')
    )[0]
  } catch (e) {
    return (await findHref(
      (await findHref(anteriores, ' Quadrimestre de '))[1],
      'Matrículas deferidas após o ajuste'
    ))[0]
  }
}
