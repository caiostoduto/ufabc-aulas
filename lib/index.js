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
        await this.fetchQuadris();
        await this.fetchMatriculas();
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
    async fetchMatriculas() {
        this.matriculasPdfURL = await this.fetchHrefMatriculas('Matrículas deferidas após o ajuste');
        this.matriculas = await (0, matriculas_1.fetchMatriculas)(this.matriculasPdfURL);
        return this;
    }
    async fetchHrefMatriculas(contains) {
        let res;
        try {
            res = await (0, utils_1.findHref)(this.MATRICULAS_URL, contains, this.$matriculas);
        }
        catch (e) {
            res = await (0, utils_1.findHref)((await (0, utils_1.findHref)(this.ANTERIORES_URL, ' Quadrimestre de '))[1], contains);
        }
        this.$matriculas = res[0];
        return res[1];
    }
}
exports.default = UFABCAulas;
module.exports = UFABCAulas;
