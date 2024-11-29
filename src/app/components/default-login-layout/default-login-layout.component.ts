import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserComponent } from '../../pages/user/user.component';

@Component({
  selector: 'app-default-login-layout',
  standalone: true,
  imports: [],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.scss'
})
export class DefaultLoginLayoutComponent {

  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";
  
  //adicionei isso para user
  @Input() btnUserTexr: string = "";
  
  @Input() disablePrimaryBtn: boolean = true;
  @Output("submit") onSubmit = new EventEmitter(); // submit do formulário

  @Output("navigate") onNavigate = new EventEmitter();
  
  //submit do formulário
  submit(){
    this.onSubmit.emit();
  }

  navigate(){
    this.onNavigate.emit();
  }

  //adicionei isso para user
  submitUser() {
    this.onSubmit.emit();
  }

  //adicionei isso para user
  navigateUser() {
    this.onNavigate.emit();
  }



}
