import { type AxiosRequestConfig } from 'axios';
import { type DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
export declare function fetch(url: string, config?: AxiosRequestConfig): Promise<any>;
export declare function extractTextsFromPdf(docParams: DocumentInitParameters): Promise<string[][]>;
