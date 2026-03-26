import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  relatedOrderId?: number;
  relatedProductId?: number;
  isRead?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private source: EventSource | null = null;

  constructor(private zone: NgZone) {}

  start(lastId = 0) {
    if (this.source) return;

    const url = `${environment.apiUrl}/stream.php?lastId=${lastId}`;
    this.source = new EventSource(url);

    this.source.onmessage = (e) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(e.data);
          const current = this.notificationsSubject.value.slice();
          current.push(data);
          this.notificationsSubject.next(current);
        } catch (err) {
          console.error('Invalid SSE data', err);
        }
      });
    };

    this.source.onerror = (err) => {
      console.error('SSE error', err);
      this.stop();
      setTimeout(() => this.start(lastId), 3000);
    };
  }

  stop() {
    if (this.source) {
      this.source.close();
      this.source = null;
    }
  }
}
