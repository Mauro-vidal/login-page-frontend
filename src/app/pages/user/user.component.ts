import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user-response';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{

  users: User[] = [];
  selectedUser: User | null = null;
  userForm!: FormGroup;
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private userService: UserServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.initForm();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = data;
      this.updatePagination();

    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1; // Resetar para a primeira página
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
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

  confirmDelete(id: string) {
    this.toastr
      .warning('Tem certeza que deseja excluir?', 'Confirmação', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
      })
      .onTap.subscribe(() => this.deleteUser(id));
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.toastr.success('Usuário excluído com sucesso!', 'Sucesso');
      this.fetchUsers();
    });
  }

  closeForm() {
    this.selectedUser = null;
    this.userForm.reset();
  }
  

}
