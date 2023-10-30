"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMatriculasAtualURL = exports.fetchMatriculas = void 0;
const utils_1 = require("./utils");
const cheerio = __importStar(require("cheerio"));
async function fetchMatriculas(matriculasAtualURL) {
    var _a;
    const matriculas = new Map();
    const txt = (await (0, utils_1.extractTextsFromPdf)({
        url: matriculasAtualURL.toString(),
        verbosity: 0
    })).map((txts) => txts.filter((t) => t !== '' && t !== ' ')
        .slice(5, -1)).reduce((acc, curr) => acc.concat(curr), []);
    for (let i = 0; i < txt.length / 3; i++) {
        const [matricula, codigo] = txt.slice(i * 3, i * 3 + 2);
        matriculas.set(matricula, ((_a = matriculas.get(matricula)) !== null && _a !== void 0 ? _a : []).concat(codigo));
    }
    return matriculas;
}
exports.fetchMatriculas = fetchMatriculas;
async function fetchMatriculasAtualURL(matriculasURL) {
    const matriculasHtml = await (0, utils_1.fetch)(matriculasURL.toString());
    const $ = cheerio.load(matriculasHtml);
    const matriculasElement = $('a:contains("Matrículas deferidas após o ajuste")');
    if (matriculasElement.length === 0) {
        throw new Error('Não foi possível encontrar as matrículas.');
    }
    return new URL(`https://${matriculasURL.host}${matriculasElement.attr('href')}`);
}
exports.fetchMatriculasAtualURL = fetchMatriculasAtualURL;
