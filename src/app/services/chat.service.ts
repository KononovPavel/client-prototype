import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ChatModel, MessageModel} from "../models/chat.model";
import {HttpClient} from "@angular/common/http";
import {APIEnum} from "../constants/API.enum";
import {io} from 'socket.io-client'


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {
  }

  socket = io('http://localhost:3000')

  public message$: BehaviorSubject<MessageModel> = new BehaviorSubject<MessageModel>({} as MessageModel);
  public chat$: BehaviorSubject<ChatModel> = new BehaviorSubject<ChatModel>({} as ChatModel);


  public createChat(from: string, to: string) {
    this.socket.emit('sendChat', {from, to});
  }

  public getChatsByCustomer(customerId: string): Observable<ChatModel[]> {
    return this.http.get<ChatModel[]>(APIEnum.CHAT + '/' + customerId).pipe();
  }

  public sendMessage(chatId: string, message: MessageModel) {
    this.socket.emit('sendMessage', {chatId: chatId, message: message});
  }

  public getMessage(): Observable<MessageModel> {
    this.socket.on('getMessage', (message: MessageModel) => {
      this.message$.next(message)
    })
    return this.message$.asObservable()
  }

  public getChat(): Observable<ChatModel> {
    this.socket.on('getChat', (chat: ChatModel) => {
      this.chat$.next(chat)
    })
    return this.chat$.asObservable();
  }

  public getMessagesByChat(chatId: string): Observable<MessageModel[]> {
   return this.http.get<MessageModel[]>(APIEnum.CHAT + '/message/' + chatId).pipe()
  }

}
