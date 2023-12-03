import { type quadri } from './quadris';
import { type CheerioAPI } from 'cheerio';
declare class UFABCAulas {
    CALENDARIOS_URL: URL;
    MATRICULAS_URL: URL;
    ANTERIORES_URL: URL;
    calendarioPdfURL: URL | undefined;
    matriculasPdfURL: URL | undefined;
    $matriculas: CheerioAPI | undefined;
    quadris: quadri[] | undefined;
    matriculas: Map<string, string[]> | undefined;
    fetch(): Promise<UFABCAulas>;
    fetchQuadris(): Promise<UFABCAulas>;
    fetchMatriculas(): Promise<UFABCAulas>;
    private fetchHrefMatriculas;
}
export default UFABCAulas;
