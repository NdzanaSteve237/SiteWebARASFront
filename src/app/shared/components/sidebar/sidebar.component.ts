import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  openSubmenus: Set<string> = new Set();

  menuItems: MenuItem[] = [
    {
      label: 'Tableau de bord',
      route: '/dashboard',
      icon: 'fas fa-home'
    },
    {
      label: 'Calendrier',
      route: '/calendar',
      icon: 'fas fa-calendar-alt'
    },
    {
      label: 'Documentation',
      route: '/documentation',
      icon: 'fas fa-book',
      children: [
        {
          label: 'Liste',
          route: '/documentation',
          icon: 'fas fa-list'
        },
        {
          label: 'Uploader',
          route: '/documentation/upload',
          icon: 'fas fa-upload'
        }
      ]
    },
    {
      label: 'Forum',
      route: '/forum',
      icon: 'fas fa-comments'
    },
    {
      label: 'Marché',
      route: '/market',
      icon: 'fas fa-store'
    },
    {
      label: 'Proverbes',
      route: '/proverbs',
      icon: 'fas fa-feather'
    }
  ];

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleMobile() {
    this.isMobileOpen = !this.isMobileOpen;
    this.mobileOpenChange.emit(this.isMobileOpen);
  }

  toggleSubmenu(item: MenuItem) {
    const key = item.label;
    if (this.openSubmenus.has(key)) {
      this.openSubmenus.delete(key);
    } else {
      this.openSubmenus.add(key);
    }
  }

  isSubmenuOpen(item: MenuItem): boolean {
    return this.openSubmenus.has(item.label);
  }
//
  @Input() isOpen: boolean = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }
}
