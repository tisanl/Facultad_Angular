import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  producto!: number;

  ngOnInit(): void {
    
    const strProduct = localStorage.getItem("producto");

    this.producto = JSON.parse(strProduct!);

    console.log(this.producto);
    

  }

}
