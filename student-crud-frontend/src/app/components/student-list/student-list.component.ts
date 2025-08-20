import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  student_list: any[] = [];
  filteredStudents: any[] = [];
  searchCourse: string = '';
  showForm = false;
  editData: any = null;
  merge_list: any[] = [];


  courseCounts: { [key: string]: number } = {};

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadMergedStudents();

  }

  loadMergedStudents() {
    this.studentService.getMergedStudents().subscribe(mergedData => {
      this.merge_list = mergedData;  
      console.log("Merged:", this.merge_list);

      this.student_list = [...this.merge_list];
      console.log(this.student_list)

      this.filteredStudents = [...this.merge_list];
      this.updateCourseCounts();
  });
}

  updateCourseCounts() {
    this.courseCounts = {};
    this.filteredStudents.forEach(stu => {
      this.courseCounts[stu.course] = (this.courseCounts[stu.course] || 0) + 1;
    });
  }


  getUniqueStudents(list: any[]): any[] {
    return list.filter(
      (stu, index, self) =>
        index === self.findIndex(s => s.email === stu.email)
    );
  }

  filterByCourse() {
    if (!this.searchCourse.trim()) {
      this.filteredStudents = [...this.merge_list];
    } else {
      this.filteredStudents = this.merge_list.filter(student =>
        student.course.toLowerCase().includes(this.searchCourse.toLowerCase())
      );
    }
    this.updateCourseCounts();
  }

  clearSearch() {
    this.searchCourse = '';
    this.filteredStudents = [...this.merge_list];
    this.updateCourseCounts();
  }

  openForm() {
    this.showForm = true;
    this.editData = null;
  }

  editStudent(student: any) {
    this.showForm = true;
    this.editData = student;
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.loadMergedStudents();
    });
  }

  closeForm(updated: boolean) {
    this.showForm = false;
    if (updated) {
      this.loadMergedStudents();
    }
  }


  getMergedStudentData(): any[] {
    return this.merge_list;
  }

  getTotalMergedCount(): number {
    return this.merge_list.length;
  }

  downloadExcel(): void {
    const exportData: any[] = [];
    this.merge_list.forEach(stu => {
      exportData.push({
        ID: stu.id,
        Name: stu.name,
        Phone: stu.phone,
        Email: stu.email,
        College: stu.college,
        Course: stu.course
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Merged Students');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'merged_students.xlsx');
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Merged Student List', 14, 10);

    const exportData: any[] = [];

    this.merge_list.forEach(stu => {
      exportData.push([
        stu.id,
        stu.name,
        stu.phone,
        stu.email,
        stu.college,
        stu.course
      ]);
    });

    autoTable(doc, {
      head: [['ID', 'Name', 'Phone', 'Email', 'College', 'Course']],
      body: exportData,
    });

    doc.save('merged_students.pdf');
  }
}

function updateCourseCounts() {
  throw new Error('Function not implemented.');
}
