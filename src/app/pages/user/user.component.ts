import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user-response';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{

  users: User[] = [];
  selectedUser: User | null = null;
  userForm!: FormGroup;

  constructor(private userService: UserServiceService, private fb: FormBuilder) {}

  ngOnInit() {
    this.fetchUsers();
    this.initForm();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
    });
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
    });
  }

  saveUser() {
    if (this.selectedUser && this.userForm.valid) {
      const updatedUser = { ...this.selectedUser, ...this.userForm.value };
      this.userService.updateUser(this.selectedUser.id, updatedUser).subscribe(() => {
        this.fetchUsers();
        this.closeForm();
      });
    }
  }

  deleteUser(id: string) {
    if(confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.fetchUsers();
      })
    }
  }

  closeForm() {
    this.selectedUser = null;
    this.userForm.reset();
  }
  

}
