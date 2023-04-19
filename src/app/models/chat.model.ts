import {CustomerModel} from "./customer.model";

export interface ChatModel {
  chatId: string
  messages: MessageModel[]
  chatName: string
  image: string;
  from: CustomerModel
  to: CustomerModel
}

export interface MessageModel {
  messageId: string
  value: string
  messageType: MessageType.STRING | MessageType.FILE;
  date: Date
  customer: CustomerModel
}

export enum MessageType {
  STRING = "STRING",
  FILE = "FILE"
}
