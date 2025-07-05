import { Component, inject } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardsService } from '../services/cards.service';
import { CardDto } from '../interfaces/cardDTO';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CreateCardDialogComponent } from '../create-card-dialog/create-card-dialog.component';
import { CardDetailDialogComponent } from '../card-detail-dialog/card-detail-dialog.component';

@Component({
  selector: 'app-cards',
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    CreateCardDialogComponent,
    CardDetailDialogComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export default class CardsComponent {
  cards: CardDto[] = [];
  totalRecords = 0;
  loading = false;
  dialogVisible = false;
  selectedCard: CardDto | null = null;
  currentFirst = 0;
  currentRows = 10;
  detailDialogVisible = false;
  detailCard: CardDto | null = null;

  private messageService = inject(MessageService);
  private cardsService = inject(CardsService);
  private confirmService = inject(ConfirmationService);

  loadPage(event: TableLazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;
    const limit = event.rows!;

    this.cardsService.getCards(page, limit).subscribe({
      next: (resp) => {
        this.cards = resp.data;
        this.totalRecords = resp.total;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se cargaron las cards',
        });
        this.loading = false;
      },
    });
  }

  onAddCard() {
    this.selectedCard = null;
    this.dialogVisible = true;
  }

  onEditCard(card: CardDto) {
    this.selectedCard = card;
    this.dialogVisible = true;
  }

  onDelete(card: CardDto) {
    this.confirmService.confirm({
      message: `¿Estás seguro de eliminar la card "${card.title}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.cardsService.deleteCard(card.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Card eliminada correctamente',
            });
            this.loadPage({ first: this.currentFirst, rows: this.currentRows });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la card',
            });
          },
        });
      },
    });
  }

  handleSave(payload: { title: string; descriptions: string[] }) {
    if (this.selectedCard) {
      this.cardsService.updateCard(this.selectedCard.id, payload).subscribe({
        next: () => {
          this.dialogVisible = false;
          this.selectedCard = null;
          this.loadPage({ first: this.currentFirst, rows: this.currentRows });
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Card editada correctamente',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo editar la card',
          });
        },
      });
    } else {
      this.cardsService.createCard(payload).subscribe({
        next: () => {
          this.dialogVisible = false;
          this.loadPage({ first: 0, rows: this.currentRows });
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Card creada correctamente',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la card',
          });
        },
      });
    }
  }

  selectCard(card: any) {
    this.detailCard = card;
    this.detailDialogVisible = true;
  }

  onCloseDetail() {
    this.detailDialogVisible = false;
    this.detailCard = null;
  }
}
