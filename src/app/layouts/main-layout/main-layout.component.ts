import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/ui/footer/footer.component';
import { SidebarComponent } from '../../shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  isSidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }
}
