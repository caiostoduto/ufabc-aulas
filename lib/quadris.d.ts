export declare function fetchQuadris(calendarioAtualURL: URL): Promise<quadri[]>;
export interface quadri {
    inicio: Date;
    fim: Date;
}
