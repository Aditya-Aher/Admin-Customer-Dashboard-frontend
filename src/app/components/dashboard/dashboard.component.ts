import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitorService } from 'src/app/services/visitor.service';
import { Visitor } from '../../model/visitor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser = 'Admin';
  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  searchTerm: string = '';
  searchField: string = 'consumerName';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(private visitorService: VisitorService, private router: Router) {}

  ngOnInit(): void {
    this.getAllVisitors();
  }

  getAllVisitors(): void {
    this.visitorService.getVisitors().subscribe({
      next: (data) => {
        this.visitors = data;
        this.filteredVisitors = data;
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (err) => console.error(err)
    });
  }

  loadVisitors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredVisitors = this.visitors.slice(startIndex, endIndex);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-warning';
      case 'Pending': return 'bg-danger';
      default: return 'bg-info';
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVisitors();
    }
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredVisitors = this.visitors.filter(visitor =>
      visitor.consumerName.toLowerCase().includes(term)
    );
  }

  addVisitor(): void {
    this.router.navigate(['/visitor']);
  }

  viewVisitor(visitor: Visitor): void {
    alert(`View Visitor: ${JSON.stringify(visitor, null, 2)}`);
  }

  editVisitor(visitor: Visitor): void {
    this.router.navigate(['/visitor', visitor.id]);
  }

  deleteVisitor(id: number): void {
    if (confirm('Are you sure to delete this visitor?')) {
      this.visitorService.deleteVisitor(id).subscribe({
        next: () => this.getAllVisitors(),
        error: (err) => console.error(err)
      });
    }
  }

  onLogout(): void {
    // Implement logout logic
  }
}
