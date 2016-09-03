export type ApiLayoutEntryType = 'create' | 'modify' | 'retrieve' | 'delete';

export interface ApiLayoutEntry {
  type : ApiLayoutEntryType;
  params : string[];
  url : string;
}

export interface ApiLayout {
  [name : string] : ApiLayoutEntry;
}
