export interface Message {
  channel: string;
  from: string;
  text?: string;
  date: Date;
}
