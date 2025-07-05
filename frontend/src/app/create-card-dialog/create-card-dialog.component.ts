import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDto } from '../interfaces/cardDTO';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-card-dialog',
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './create-card-dialog.component.html',
  styleUrl: './create-card-dialog.component.scss'
})
export class CreateCardDialogComponent {
  @Input() visible = false;
  @Input() card: CardDto | null = null;    

  @Output() save = new EventEmitter<{ title: string; descriptions: string[] }>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      descriptions: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card'] && this.card) {
      this.form.patchValue({ title: this.card.title });
      this.descriptions.clear();
      for (let d of this.card.descriptions) {
        this.descriptions.push(this.fb.control(d.description, Validators.required));
      }
    }
    if (changes['visible'] && this.visible && !this.card) {
      this.form.reset();
      this.descriptions.clear();
      this.descriptions.push(this.fb.control('', Validators.required));
    }
  }

  get descriptions(): FormArray {
    return this.form.get('descriptions') as FormArray;
  }

  addDescription() {
    this.descriptions.push(this.fb.control('', Validators.required));
  }

  removeDescription(i: number) {
    if (this.descriptions.length > 1) {
      this.descriptions.removeAt(i);
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, descriptions } = this.form.value;
    this.save.emit({ title, descriptions });
    this.onCancel();
  }

  onCancel() {
    this.cancel.emit();
    this.form.markAsPristine();
  }

}

