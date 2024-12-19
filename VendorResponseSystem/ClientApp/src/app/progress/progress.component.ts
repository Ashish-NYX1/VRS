import { Component } from '@angular/core';
import { ProgressService } from 'src/services/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {
  constructor(public progressService: ProgressService) { }

  get loading(): boolean {
    return this.progressService.loading.value;
  }
}
