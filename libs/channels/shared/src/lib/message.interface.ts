export interface Message {
  id: string;
  channel: string;
  from: string;
  text?: string;
  date: Date;
}
