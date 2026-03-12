import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MedicationOrder } from "./components/medication-order/medication-order";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MedicationOrder],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('medication-app');
}
