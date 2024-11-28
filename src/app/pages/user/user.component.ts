import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  selectedUser: User | null = null;
  userForm!: FormGroup;

  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private userService: UserServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.initForm();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = data;
      this.updatePagination();
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  }

  saveUser(): void {
    if (this.selectedUser && this.userForm.valid) {
      const updatedUser = { ...this.selectedUser, ...this.userForm.value };
      this.userService.updateUser(this.selectedUser.id, updatedUser).subscribe(() => {
        this.toastr.success('Usuário atualizado com sucesso!', 'Sucesso');
        this.fetchUsers();
        this.closeForm();
      });
    }
  }

  confirmDelete(id: string): void {
    this.toastr
      .warning('Tem certeza que deseja excluir?', 'Confirmação', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
      })
      .onTap.subscribe(() => this.deleteUser(id));
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.toastr.success('Usuário excluído com sucesso!', 'Sucesso');
      this.fetchUsers();
    });
  }

  closeForm(): void {
    this.selectedUser = null;
    this.userForm.reset();
  }
}
