import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ChatModel, MessageModel, MessageType} from "../../models/chat.model";
import {extractCustomerId} from "../../utils/customer.utils";
import {Subject, takeUntil, tap} from "rxjs";
import {CustomerModel} from "../../models/customer.model";
import {CustomerService} from "../../services/customer.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.sass']
})
export class ChatPageComponent implements OnInit {

  constructor(private chatService: ChatService,
              private cdr: ChangeDetectorRef,
              private customerService: CustomerService) {
  }


  chats: ChatModel[];
  messages: MessageModel[];
  showLoader: boolean;
  showSearchLoader: boolean;
  selectedChat: string;

  foundedCustomer: CustomerModel | null;

  customer: CustomerModel

  searchForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required])
  })

  messageControl = new FormControl('', [Validators.required])


  customerId: string = extractCustomerId();
  private destroy$: Subject<void> = new Subject<void>()

  ngOnInit(): void {
    this.showLoader = true
    this.chatService.getChatsByCustomer(this.customerId)
      .pipe(
        takeUntil(this.destroy$),
        tap((chats: ChatModel[]) => {
          this.chats = chats;
          this.selectedChat = chats?.[0]?.chatId;
          this.messages = chats?.[0]?.messages
          this.showLoader = false;
          this.cdr.markForCheck()
        })
      ).subscribe()

    this.customerService.getCustomerById(this.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => this.customer = customer)

    this.chatService.getMessage().subscribe((message: MessageModel) => {
      this.messages?.push(message);
      this.cdr.markForCheck()
    })

    this.chatService.getChat().subscribe((chat: ChatModel) => {
      this.chats?.push(chat);
      this.cdr.markForCheck()
    })
  }

  handleSearchField() {
    this.showSearchLoader = true;
    this.customerService.getCustomerByPhoneNumber(this.searchForm.controls['phoneNumber'].value!).pipe(
      takeUntil(this.destroy$),
      tap((customer: CustomerModel | null) => {
        if (customer !== null) {
          this.foundedCustomer = customer;
          this.showSearchLoader = false;
          this.cdr.markForCheck()
        } else {
          this.foundedCustomer = null;
          this.showSearchLoader = false;
          this.cdr.markForCheck()
        }
      })
    ).subscribe()

  }

  createChat() {
    this.chatService.createChat(this.customerId, this.foundedCustomer?.customerId!);
    this.foundedCustomer = null;
    this.cdr.markForCheck()

  }

  sendMessage() {
    if (this.messageControl.valid) {
      this.chatService.sendMessage(this.selectedChat, {
        value: this.messageControl.value,
        customer: this.customer,
        messageType: MessageType.STRING
      } as MessageModel);
      this.messageControl.setValue('')
    }
  }

  setSelectedChat(chatId: string) {
    this.showLoader = true;
    this.selectedChat = chatId;
    this.chatService.getMessagesByChat(chatId).pipe(
      takeUntil(this.destroy$),
      tap((messages: MessageModel[]) => {
        this.showLoader = false;
        this.messages = messages;
        this.cdr.markForCheck()
      })
    ).subscribe()
  }
}
