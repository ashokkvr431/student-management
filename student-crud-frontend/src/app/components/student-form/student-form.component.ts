import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  @Input() editData: any = null;
  @Output() formClose = new EventEmitter<boolean>();

  name = '';
  email = '';
  course = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    if (this.editData) {
      this.name = this.editData.name;
      this.email = this.editData.email;
      this.course = this.editData.course;
    }
  }

  saveStudent() {
    const student = { name: this.name, email: this.email, course: this.course };
    if (this.editData) {
      this.studentService.updateStudent(this.editData.id, student).subscribe(() => {
        this.close(true);
      });
    } else {
      this.studentService.addStudent(student).subscribe(() => {
        this.close(true);
      });
    }
  }

  close(updated: boolean) {
    this.formClose.emit(updated);
  }
}
