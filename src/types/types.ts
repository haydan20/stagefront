export type ProcessT = {
  _id: string;
  name: string;
  subprocesses: ProcessT[];
  tools: string;
  responsible: string;
  documentation: string;
  isSystemic: boolean;
};

export type Area = {
  _id: string;
  name: string;
  processes:ProcessT[]
};