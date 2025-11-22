import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './app.services';
import { ApiRequest, ApiResponse, HttpMethod, RequestHistoryItem } from './app.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private apiService = inject(ApiService);

  // --- Signals (Estado) ---
  request = signal<ApiRequest>({
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}'
  });

  response = signal<ApiResponse | null>(null);
  isLoading = signal<boolean>(false);
  activeTab = signal<'params' | 'headers' | 'body'>('body');
  
  // Historial
  history = signal<RequestHistoryItem[]>([]);
  showHistory = signal<boolean>(false);

  methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  constructor() {
    // Cargar historial al iniciar la app
    const saved = localStorage.getItem('api_history');
    if (saved) {
      try {
        this.history.set(JSON.parse(saved));
      } catch(e) { 
        console.error('Error al leer historial', e); 
      }
    }
  }

  // --- Acciones ---

  addHeader() {
    this.request.update(req => ({
      ...req,
      headers: [...req.headers, { key: '', value: '' }]
    }));
  }

  removeHeader(index: number) {
    this.request.update(req => ({
      ...req,
      headers: req.headers.filter((_, i) => i !== index)
    }));
  }

  setActiveTab(tab: 'params' | 'headers' | 'body') {
    this.activeTab.set(tab);
  }

  send() {
    if (!this.request().url) return;
    
    this.isLoading.set(true);
    this.response.set(null);

    // Guardamos en historial
    this.addToHistory();

    this.apiService.sendRequest(this.request()).subscribe({
      next: (res) => {
        this.response.set(res);
        this.isLoading.set(false);
      }
    });
  }

  // --- Lógica del Historial ---

  addToHistory() {
    const newItem: RequestHistoryItem = { 
      ...this.request(), 
      timestamp: new Date() 
    };
    
    // Agregamos al principio y guardamos los últimos 10
    const currentHistory = [newItem, ...this.history()].slice(0, 10);
    
    this.history.set(currentHistory);
    localStorage.setItem('api_history', JSON.stringify(currentHistory));
  }

  loadFromHistory(item: RequestHistoryItem) {
    this.request.set({
      url: item.url,
      method: item.method,
      headers: item.headers,
      body: item.body
    });
    this.showHistory.set(false); // Cerrar panel
  }
  
  toggleHistory() {
    this.showHistory.update((v: boolean) => !v);
  }
  
  clearHistory() {
    this.history.set([]);
    localStorage.removeItem('api_history');
  }

  // --- Helpers ---

  get supportsBody(): boolean {
    return ['POST', 'PUT', 'PATCH'].includes(this.request().method);
  }

  getStatusColor(status: number): string {
    if (status >= 200 && status < 300) return 'text-green';
    if (status >= 400 && status < 500) return 'text-orange';
    if (status >= 500) return 'text-red';
    return 'text-gray';
  }

  // ... resto del código ...

  // Función para colorear sintaxis JSON
  formatJson(json: any): string {
    if (!json) return '';
    let jsonString = JSON.stringify(json, null, 2);
    
    // Regex mágica para detectar keys, strings, numbers, booleans y nulls
    jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'; // Es una clave "key":
        } else {
          cls = 'string'; // Es un texto "value"
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }
}