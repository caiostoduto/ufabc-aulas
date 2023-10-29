import axios, { type AxiosRequestConfig } from 'axios'
import { getDocument } from 'pdfjs-dist'
import { type DocumentInitParameters, type TextItem } from 'pdfjs-dist/types/src/display/api'

export async function fetch (url: string, config: AxiosRequestConfig = {}): Promise<any> {
  const res = await axios.get(url, config)
  if (res.status !== 200) {
    throw new Error('Não foi possível acessar o site da UFABC')
  }

  return res.data
}

export async function extractTextsFromPdf (docParams: DocumentInitParameters): Promise<string> {
  const pdf = await getDocument(docParams).promise

  let txt = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    txt += (await (await pdf.getPage(i)).getTextContent())
      .items.map((item) => (item as TextItem).str).join('')
  }

  return txt
}
