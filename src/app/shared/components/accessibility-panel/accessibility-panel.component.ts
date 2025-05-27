import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AccessibilityPanelComponent {
  isOpen = false;
  isDark = false;
  fontSize = 100; // Default font size percentage
  private readonly minFontSize = 60; // 4 reductions (100 - 4*10)
  private readonly maxFontSize = 140; // 4 increases (100 + 4*10)

  togglePanel() {
    this.isOpen = !this.isOpen;
  }

  toggleContrast() {
    this.isDark = !this.isDark;
    const body = document.body;
    if (this.isDark) {
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    } else {
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    }
  }

  increaseFontSize() {
    if (this.fontSize < this.maxFontSize) {
      this.fontSize += 10;
      this.applyFontSize();
    }
  }

  decreaseFontSize() {
    if (this.fontSize > this.minFontSize) {
      this.fontSize -= 10;
      this.applyFontSize();
    }
  }

  resetFontSize() {
    this.fontSize = 100;
    this.applyFontSize();
  }

  private applyFontSize() {
    document.documentElement.style.fontSize = `${this.fontSize}%`;
  }
} 