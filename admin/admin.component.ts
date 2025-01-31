import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent  {
}
