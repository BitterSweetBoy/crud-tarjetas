import { Component, inject, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { CardLog, LogAction } from '../interfaces/activityDTO';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-activity',
  imports: [CommonModule, TagModule, TableModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export default class ActivityComponent implements OnInit {
  private activityService = inject(ActivityService);
  activityLogs: CardLog[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadActivity();
  }

  loadActivity() {
    this.loading = true;
    this.activityService.getRecentActivity(1, 20).subscribe({
      next: (logs: any) => {
        console.log(logs);
        this.activityLogs = logs ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading activity logs', err);
        this.loading = false;
      }
    });
  }

  getActionColor(action: LogAction): string {
    switch (action) {
      case LogAction.CREATE:
        return 'success';
      case LogAction.UPDATE:
        return 'info';
      case LogAction.DELETE:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatDate(date: Date | string): string {
    return formatDate(date, 'medium', 'en-US');
  }

  getChanges(log: CardLog): string[] {
  const changes: string[] = [];

  const oldTitle = log.old_data?.title;
  const newTitle = log.new_data?.title;

  switch (log.action) {
    case LogAction.CREATE:
      if (newTitle) {
        changes.push(`Se creó la card "${newTitle}"`);
      }
      break;

    case LogAction.UPDATE:
      if (oldTitle && newTitle && oldTitle !== newTitle) {
        changes.push(`Título cambiado de "${oldTitle}" a "${newTitle}"`);
      } else if (oldTitle && newTitle) {
        changes.push(`Card "${newTitle}" actualizada sin cambio en el título`);
      }

      if (
        Array.isArray(log.old_data?.descriptions) &&
        Array.isArray(log.new_data?.descriptions)
      ) {
        const oldDesc = log.old_data.descriptions.map((d: any) => d.description);
        const newDesc = log.new_data.descriptions.map((d: any) => d.description);

        if (JSON.stringify(oldDesc) !== JSON.stringify(newDesc)) {
          changes.push('Descripciones modificadas');
        }
      }
      break;

    case LogAction.DELETE:
      if (oldTitle) {
        changes.push(`Se eliminó la card "${oldTitle}"`);
      } else {
        changes.push(`Se eliminó una card sin título`);
      }
      break;

    default:
      changes.push('Sin detalles disponibles');
  }

  return changes;
}


}
