import { Component} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-gym-schedule',
  imports: [NavbarComponent],
  templateUrl: './gym-schedule.component.html',
  styleUrls: ['./gym-schedule.component.scss'],
  standalone: true,
})
export class GymScheduleComponent{
}
