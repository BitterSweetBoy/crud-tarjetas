import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CardDto } from '../interfaces/cardDTO';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { CardLog } from '../interfaces/activityDTO';
import { ActivityService } from '../services/activity.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-card-detail-dialog',
  imports: [CommonModule, DialogModule, ButtonModule, TabsModule],
  templateUrl: './card-detail-dialog.component.html',
  styleUrl: './card-detail-dialog.component.scss',
})
export class CardDetailDialogComponent {
  @Input() visible = false;
  @Input() card: CardDto | null = null;
  @Output() close = new EventEmitter<void>();

  logs: CardLog[] = [];
  loadingLogs = false;
  activeTab = 0;

  private activityService = inject(ActivityService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.activeTab = 0;
      if (this.card) {
        this.loadHistory();
      }
    }
  }

  hide() {
    this.close.emit();
    this.logs = [];
  }

  private loadHistory() {
    this.loadingLogs = true;
    this.activityService.getActivityByEntity('CARD', this.card!.id).subscribe({
      next: (resp: any) => {
        this.logs = Array.isArray(resp) ? resp : resp.data ?? [];
        this.loadingLogs = false;
      },
      error: () => {
        this.loadingLogs = false;
      },
    });
  }

  formatDate(dt: string | Date) {
    return formatDate(dt, 'medium', 'en-US');
  }

  getActionClasses(action: string): string {
    switch (action?.toLowerCase()) {
      case 'create':
      case 'created':
        return 'bg-green-500';
      case 'update':
      case 'updated':
        return 'bg-blue-500';
      case 'delete':
      case 'deleted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  getActionIcon(action: string): string {
    switch (action?.toLowerCase()) {
      case 'create':
      case 'created':
        return 'pi pi-plus';
      case 'update':
      case 'updated':
        return 'pi pi-pencil';
      case 'delete':
      case 'deleted':
        return 'pi pi-trash';
      default:
        return 'pi pi-info';
    }
  }

  getActionText(action: string): string {
    switch (action?.toLowerCase()) {
      case 'create':
      case 'created':
        return 'Creado';
      case 'update':
      case 'updated':
        return 'Actualizado';
      case 'delete':
      case 'deleted':
        return 'Eliminado';
      default:
        return action;
    }
  }

  getTitle(data: any): string {
    if (!data) return '—';
    return data.title || '—';
  }

  getDescriptions(data: any): string {
    if (!data || !data.descriptions) return '—';

    if (Array.isArray(data.descriptions)) {
      return data.descriptions.map((d: any) => d.description || d).join(', ');
    }

    return '—';
  }

  hasChanges(oldData: any, newData: any): boolean {
    return (
      oldData && newData && JSON.stringify(oldData) !== JSON.stringify(newData)
    );
  }
}
