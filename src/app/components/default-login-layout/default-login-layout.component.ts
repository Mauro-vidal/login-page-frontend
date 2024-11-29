import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-login-layout',
  standalone: true,
  templateUrl: './default-login-layout.component.html',
  styleUrls: ['./default-login-layout.component.scss'],
})
export class DefaultLoginLayoutComponent {
  @Input() title: string = '';
  @Input() primaryBtnText: string = '';
  @Input() secondaryBtnText: string = '';
  @Input() btnUserTexr: string = '';
  @Input() disablePrimaryBtn: boolean = true;

  @Output() submit = new EventEmitter(); // submit do formulário
  @Output() navigate = new EventEmitter();

  constructor(private router: Router) {}

  submitForm() {
    this.submit.emit();
  }

  navigateSignup() {
    this.navigate.emit();
  }

  navigateUser() {
    this.router.navigate(['user']);
  }
}
