import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // Importowanie HttpErrorResponse do określenia typu błędu

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // Teraz od razu wywołujemy logowanie bez potrzeby pobierania CSRF tokenu
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response && response.token) {
          this.router.navigate(['/admin']); // Przekierowanie po zalogowaniu
        } else {
          console.error('No token found in response');
          alert('Incorrect login or password');
        }
      },
      (error: HttpErrorResponse) => {  // Określamy typ 'HttpErrorResponse' dla błędu
        console.error('Login failed', error);
        alert('Login failed');
      }
    );
  }
}
