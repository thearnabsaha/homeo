import symptomsJson from "./symptoms.json";
import remediesJson from "./remedies.json";
import rubricsJson from "./rubrics.json";

export type SymptomsData = typeof symptomsJson;
export type RemediesData = typeof remediesJson;
export type RubricsData = Record<string, { remedyId: string; grade: number }[]>;

export const symptomsData: SymptomsData = symptomsJson;
export const remediesData: RemediesData = remediesJson;
export const rubrics: RubricsData = rubricsJson as unknown as RubricsData;
