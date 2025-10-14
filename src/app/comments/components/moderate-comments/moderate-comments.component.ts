import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommentService } from '../../../comments/services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { momentCalculateTimeFromNow } from '../../../shared/date.utils';

@Component({
  selector: 'app-moderate-comments',
  templateUrl: './moderate-comments.component.html',
  styleUrl: './moderate-comments.component.scss'
})
export class ModerateCommentsComponent implements OnInit, OnDestroy {

  @Output() counterUpdated = new EventEmitter<number>();

  authenticated!: boolean;
  listComments: any = [];
  comment!: any;
  totalModeratedComments: number = 0;
  isLoading: boolean = false;
  
  private destroy$ = new Subject<void>();
  private refreshTimeout?: number; // Para gestionar setTimeout

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.getAllCommentsToModerate();
    this.countModeratedComments();
  }

  ngOnDestroy() {
    // Limpiar timeout si existe
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = undefined;
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllCommentsToModerate() {
    this.isLoading = true;
    this.commentService.getCommentsToModerate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.listComments = comments;
          this.totalModeratedComments = comments.length;
          this.counterUpdated.emit(this.totalModeratedComments);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar comentarios:', error);
          this.isLoading = false;
        }
      });
  }

  approveModeratedComment(commentUuid: string) {
    this.commentService.approveModeratedComment(commentUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          this.comment = comment;
          // Recargar lista después de aprobar
          this.getAllCommentsToModerate();
          this.refreshCounter();
        }, 
        error: (error) => {
          console.error('Error al aprobar comentario:', error);
        }
      });
  }

  rejectModeratedComment(commentUuid: string) {
    this.commentService.rejectModerateComment(commentUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          this.comment = comment;
          // Recargar lista después de rechazar
          this.getAllCommentsToModerate();
          this.refreshCounter();
        },
        error: (error) => {
          console.error('Error al rechazar comentario:', error);
        }
      });
  }

  deleteModeratedComment(commentUuid: string) {
    this.commentService.deleteModerateComment(commentUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          this.comment = comment;
          // Recargar lista después de eliminar
          this.getAllCommentsToModerate();
          this.refreshCounter();
        },
        error: (error) => {
          console.error('Error al eliminar comentario:', error);
        }
      });
  }

  countModeratedComments() {
    this.commentService.countModeratedComments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (totalModeratedComments) => {
          this.totalModeratedComments = totalModeratedComments;
          this.counterUpdated.emit(this.totalModeratedComments);
        },
        error: (error) => {
          console.error('Error al contar comentarios:', error);
        }
      });
  }

  onButtonApprovComment(event: any) {
    const isChecked = event.target.checked;
    const uuid = event.target.value;
    if (isChecked) {
      this.approveModeratedComment(uuid);
    }
  }

  onButtonDeleteComment(uuid: string) {
    this.deleteModeratedComment(uuid);
  }

  // Formatea la fecha relativa
  formatCommentDate(date: string): string {
    return momentCalculateTimeFromNow(date);
  }

  // Método para refrescar el contador después de acciones
  private refreshCounter() {
    // Limpiar timeout anterior si existe
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    // Crear nuevo timeout
    this.refreshTimeout = window.setTimeout(() => {
      this.countModeratedComments();
      this.refreshTimeout = undefined; // Limpiar referencia
    }, 500); // Pequeño delay para asegurar que el backend procese la acción
  }

}
