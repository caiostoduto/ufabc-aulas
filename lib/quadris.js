"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchQuadris = void 0;
const utils_1 = require("./utils");
const re2_1 = __importDefault(require("re2"));
const MONTHS = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'].reverse();
async function fetchQuadris(calendarioAtualURL) {
    const txt = (await (0, utils_1.extractTextsFromPdf)({
        url: calendarioAtualURL.toString()
    })).map((txts) => txts.join('')).join('');
    const inicios = findInicios(txt);
    const fins = findFins(txt);
    return inicios.map((val, i) => ({ inicio: val, fim: fins[i] }));
}
exports.fetchQuadris = fetchQuadris;
function findFins(txt) {
    const re = (0, re2_1.default)(/(\d\d?) Conclusão do \dº quadrimestre de 202\d/gi);
    const matches = Array.from(txt.matchAll(re));
    if (matches.length !== 3) {
        throw new Error('Não foi possível encontrar os fins das aulas.');
    }
    const dates = [];
    let lastIndex = 0;
    let months = [...MONTHS];
    matches.forEach((match) => {
        const month = findMonth(txt.slice(lastIndex, match.index), months);
        const date = new Date();
        date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        date.setHours(0, 0, 0, 0);
        date.setDate(parseInt(match[1]));
        date.setMonth(11 - month);
        dates.push(date);
        lastIndex = match.index;
        months = months.slice(0, month);
    });
    return dates;
}
function findInicios(txt) {
    const re = (0, re2_1.default)(/(\d\d?) Início das Aulas/gi);
    const matches = Array.from(txt.matchAll(re));
    if (matches.length !== 3) {
        throw new Error('Não foi possível encontrar os inícios das aulas.');
    }
    const dates = [];
    let lastIndex = 0;
    let months = [...MONTHS];
    matches.forEach((match) => {
        const month = findMonth(txt.slice(lastIndex, match.index), months);
        const date = new Date();
        date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        date.setHours(0, 0, 0, 0);
        date.setDate(parseInt(match[1]));
        date.setMonth(11 - month);
        dates.push(date);
        lastIndex = match.index;
        months = months.slice(0, month);
    });
    return dates;
}
function findMonth(txt, months) {
    for (const month of months) {
        const re = (0, re2_1.default)(month, 'g');
        const match = txt.match(re);
        if (match !== null) {
            return months.indexOf(month);
        }
    }
    throw new Error('Não foi possível encontrar o mês.');
}
