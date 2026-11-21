import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [ RouterOutlet,
    MatSidenavModule,
    Sidebar,
    Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
