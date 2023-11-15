"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch$Matriculas = exports.findHref = exports.extractTextsFromPdf = exports.fetch = void 0;
const axios_1 = __importDefault(require("axios"));
const pdfjs_dist_1 = require("pdfjs-dist");
const cheerio_1 = require("cheerio");
async function fetch(url, config = {}) {
    const res = await axios_1.default.get(url, config);
    if (res.status !== 200) {
        throw new Error('Não foi possível acessar o site da UFABC');
    }
    return res.data;
}
exports.fetch = fetch;
async function extractTextsFromPdf(docParams) {
    const pdf = await (0, pdfjs_dist_1.getDocument)(docParams).promise;
    const txts = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        txts.push((await (await pdf.getPage(i)).getTextContent())
            .items.map((item) => item.str));
    }
    return txts;
}
exports.extractTextsFromPdf = extractTextsFromPdf;
async function findHref(url, contains) {
    const html = await fetch(url.toString());
    const $ = (0, cheerio_1.load)(html);
    const elements = $(`a:contains("${contains}")`);
    if (elements.length === 0) {
        throw new Error();
    }
    else {
        return [$, new URL(`https://${url.host}${elements.attr('href')}`)];
    }
}
exports.findHref = findHref;
async function fetch$Matriculas(atual, anteriores) {
    try {
        return (await findHref(atual, 'Matrículas deferidas após o ajuste'))[0];
    }
    catch (e) {
        return (await findHref((await findHref(anteriores, ' Quadrimestre de '))[1], 'Matrículas deferidas após o ajuste'))[0];
    }
}
exports.fetch$Matriculas = fetch$Matriculas;
