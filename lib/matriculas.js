"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMatriculas = void 0;
const utils_1 = require("./utils");
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
