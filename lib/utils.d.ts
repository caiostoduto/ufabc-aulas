import { type AxiosRequestConfig } from 'axios';
import { type DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
import { type CheerioAPI } from 'cheerio';
export declare function fetch(url: string, config?: AxiosRequestConfig): Promise<any>;
export declare function extractTextsFromPdf(docParams: DocumentInitParameters): Promise<string[][]>;
export declare function findHref(url: URL, contains: string, $?: CheerioAPI): Promise<[CheerioAPI, URL]>;
