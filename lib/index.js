"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quadris_1 = require("./quadris");
const matriculas_1 = require("./matriculas");
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
        this.calendarioAtualURL = await (0, quadris_1.fetchCalendarioAtualURL)(this.CALENDARIOS_URL);
        this.quadris = await (0, quadris_1.fetchQuadris)(this.calendarioAtualURL);
        return this;
    }
    async fetchMatriculas() {
        this.matriculasAtualURL = await (0, matriculas_1.fetchMatriculaURL)(this.MATRICULAS_URL, this.ANTERIORES_URL);
        this.matriculas = await (0, matriculas_1.fetchMatriculas)(this.matriculasAtualURL);
        return this;
    }
}
exports.default = UFABCAulas;
module.exports = UFABCAulas;
