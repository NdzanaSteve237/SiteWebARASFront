import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // État initial
  private state: SidebarState = {
    isCollapsed: false,
    isMobileOpen: false
  };

  // Subjects pour la réactivité
  private sidebarState = new BehaviorSubject<SidebarState>(this.state);

  // Observables publics
  sidebarState$ = this.sidebarState.asObservable();

  constructor() {
    // Gestion de l'état du sidebar en fonction de la taille de l'écran
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  // Méthodes publiques
  toggleCollapse(): void {
    this.updateState({
      ...this.state,
      isCollapsed: !this.state.isCollapsed
    });
  }

  toggleMobile(): void {
    this.updateState({
      ...this.state,
      isMobileOpen: !this.state.isMobileOpen
    });
  }

  closeMobile(): void {
    this.updateState({
      ...this.state,
      isMobileOpen: false
    });
  }

  // Méthodes privées
  private updateState(newState: SidebarState): void {
    this.state = newState;
    this.sidebarState.next(this.state);
  }

  private handleResize(): void {
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile && this.state.isMobileOpen) {
      this.closeMobile();
    }

    if (isMobile && !this.state.isCollapsed) {
      this.updateState({
        ...this.state,
        isCollapsed: true
      });
    }
  }
}