export type Integer = number;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonArray extends Array<JsonValue> {}

export interface JsonObject { [key: string]: JsonValue }

export type JsonValue = Literal | JsonObject | JsonArray | null

export type Literal = boolean | number | string;

export type MaybeNull<T> = T | null;

export type SortComparison = -1 | 0 | 1;
