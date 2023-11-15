"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quadris_1 = require("./quadris");
const matriculas_1 = require("./matriculas");
const utils_1 = require("./utils");
class UFABCAulas {
    constructor() {
        this.CALENDARIOS_URL = new URL('https://prograd.ufabc.edu.br/calendarios');
        this.MATRICULAS_URL = new URL('https://prograd.ufabc.edu.br/matriculas');
        this.ANTERIORES_URL = new URL('https://prograd.ufabc.edu.br/matriculas/arquivo');
    }
    async fetch() {
        const $ = await (0, utils_1.fetch$Matriculas)(this.MATRICULAS_URL, this.ANTERIORES_URL);
        await this.fetchQuadris();
        await this.fetchMatriculas($);
        return this;
    }
    async fetchQuadris() {
        try {
            this.calendarioPdfURL = (await (0, utils_1.findHref)(this.CALENDARIOS_URL, 'Calendário de procedimentos administrativo-acadêmicos'))[1];
        }
        catch (e) {
            throw new Error('Não foi possível encontrar o calendário.');
        }
        this.quadris = await (0, quadris_1.fetchQuadris)(this.calendarioPdfURL);
        return this;
    }
    async fetchMatriculas($) {
        if ($ === undefined) {
            $ = await (0, utils_1.fetch$Matriculas)(this.MATRICULAS_URL, this.ANTERIORES_URL);
        }
        const elements = $('a:contains("Matrículas deferidas após o ajuste")');
        if (elements.length === 0) {
            throw new Error('Não foi possível encontrar as matrículas.');
        }
        this.matriculasPdfURL = new URL(`https://${this.MATRICULAS_URL.host}${elements.attr('href')}`);
        this.matriculas = await (0, matriculas_1.fetchMatriculas)(this.matriculasPdfURL);
        return this;
    }
}
exports.default = UFABCAulas;
module.exports = UFABCAulas;
