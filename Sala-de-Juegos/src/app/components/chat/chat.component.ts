import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';

import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMsjErrorComponent } from '../../components/modal-msj-error/modal-msj-error.component';

import { Observable, Subscription } from 'rxjs';
import { ConexionSupabaseService } from '../../services/conexionSupabase/conexion-supabase.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

export class Chat {
  id?: string;
  created_at!: string;
  usuario_id!: string;
  usuario_nombre?: string;
  content?: string;

  get hora() {
    const normalizado = this.created_at.replace(/\.(\d{3})\d+/, '.$1');
    const fecha = new Date(normalizado);
    const hh = fecha.getHours().toString().padStart(2, '0');
    const mm = fecha.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgFor, NgIf, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {

  public chats!: Array<Chat>;
  public nuevoMensaje?: string;

  private chatSubscription!: Subscription;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private db: ConexionSupabaseService, public usuario: UsuarioService, private router: Router, private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  enviar() {
    this.guardarChat()
  }

  ngOnInit(): void {
    this.getChats()
    this.chatSubscription = this.getObservableChats().subscribe({
      next: chat => {
        this.chats.push(chat);
        this.scrollToBottom();
      },
      error: err => console.error('Error en suscripción de chat:', err)
    });

    this.scrollToBottom();

    // Esto es equivalente, al pasar solo una funcion se asume que es para next
    // this.chatSubscription = this.getObservableChats().subscribe(chat => this.chats.push(chat));
  }

  ngOnDestroy() {
    this.chatSubscription.unsubscribe();
  }

  getObservableChats(): Observable<Chat> {
    // new Observable crea un flujo de datos al que otro se puede subscribir
    // Recibe un observer, que me da .next(), .error() y .complete()
    // observer es quien escucha este observable que estoy generando y emite a los suscriptores
    return new Observable(observer => {
      // channel guarda la referencia al canal realtime
      const channel = this.db.cliente
        .channel('public:chat-table') // Cremos el canal llamado como lo que pasamos por parametro
        .on<Chat>( // Con chat le indico que son esos datos
          'postgres_changes', // Esto indica que tipo de cambios vamos a escuchar
          { event: 'INSERT', schema: 'public', table: 'chat' }, // Filtramos solo INSERT
          // Esto seria el callback, funcion que se ejecuta cuando llega un evento
          // payload es lo que recibo cuando llega un evento
          // Contiene { eventType, schema, table, new, old }
          payload => {
            if (!payload.new)
              // si no viene el objeto new, lo tratamos como error
              observer.error(new Error('Payload mal formado'));
            else
              observer.next(Object.assign(new Chat(), payload.new));
          } // Se emite el contenido que quiero que reciba quien se suscriba al observable
        )
        .subscribe() // Inicia la escucha en tiempo real

      // La función que devolvemos se ejecuta cuando quien se suscribe llama a .unsubscribe().
      // Eso lo hace RxJS porque es asi de piola
      return () => {
        this.db.cliente.removeChannel(channel);
      };
    });
  }

  async getChats() {
    const { data, error } = await this.db.cliente.from('chat').select('*');

    if (error)
      throw new Error('Problema accediendo a la base de datos');

    else if (data === null)
      throw new Error('Usuario no encontrado');

    this.chats = data.map(c => Object.assign(new Chat(), c));
    this.scrollToBottom()
  }

  async guardarChat() {
    const { error } = await this.db.cliente.from('chat').insert([{ usuario_nombre: this.usuario.data!.nombre, content: this.nuevoMensaje, usuario_id: this.usuario.data!.id }]);

    if (error)
      throw new Error('Problema accediendo a la base de datos');

    this.nuevoMensaje = '';
  }

  private scrollToBottom() {
    this.cdr.detectChanges();
    const elementoChat = this.chatContainer?.nativeElement;
    elementoChat.scrollTop = elementoChat.scrollHeight;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enviar();
    }
  }

  mostrarError(mensaje: string) {
    const modalRef = this.modalService.open(ModalMsjErrorComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'custom-modal-style'
    });

    modalRef.componentInstance.titulo = 'Error en el Login';
    modalRef.componentInstance.mensaje = mensaje;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

}
