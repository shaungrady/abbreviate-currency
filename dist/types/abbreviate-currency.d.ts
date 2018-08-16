/*! Written with love by Shaun Grady — https://shaungrady.com */
interface Config {
    language?: string;
    currency?: string;
    useLowerCaseSymbols?: boolean;
    digitGroups?: DigitGroup[];
}
interface DigitGroup {
    digits: number;
    symbol: string;
}
export declare class AbbreviateCurrency {
    static defaultConfig: Config;
    readonly language: string;
    readonly currency: string;
    readonly useLowerCaseSymbols: boolean;
    readonly digitGroups: DigitGroup[];
    private readonly processedDigitGroups;
    private readonly radixSymbol;
    private readonly fractionalDisplayLimit;
    constructor(config?: Config);
    transform(value: number | string): string;
    readonly config: Config;
    private processDigitGroups;
    private normalize;
    private format;
    private stripZeroedFractionalPart;
    private getFractionalPart;
}
export {};
