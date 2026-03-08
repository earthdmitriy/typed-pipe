export type LogFn = (params: {
  value: unknown;
  idx: number;
  fnc: Function;
}) => void;
