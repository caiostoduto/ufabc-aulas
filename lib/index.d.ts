import { type quadri } from './quadris';
declare class UFABCAulas {
    CALENDARIOS_URL: URL;
    MATRICULAS_URL: URL;
    calendarioAtualURL: URL | undefined;
    matriculasAtualURL: URL | undefined;
    turmasAtualURL: URL | undefined;
    quadris: quadri[] | undefined;
    matriculas: Map<string, string[]> | undefined;
    fetch(): Promise<UFABCAulas>;
    fetchQuadris(): Promise<UFABCAulas>;
    fetchMatriculas(): Promise<UFABCAulas>;
}
export default UFABCAulas;
