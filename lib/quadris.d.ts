export declare function fetchQuadris(calendarioAtualURL: URL): Promise<quadri[]>;
export declare function fetchCalendarioAtualURL(calendariosURL: URL): Promise<URL>;
export interface quadri {
    inicio: Date;
    fim: Date;
}
