import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  
  miFormulario: FormGroup = this.fb.group({
    name:['test4', [Validators.required,]],
    email:['test4@test.com', [Validators.required, Validators.email]],
    password:['123456', [Validators.required, Validators.minLength(6)]]
  })
  
  constructor(private fb: FormBuilder, private router:Router, private authService:AuthService ) { 

  }
  registro() { 
    const {name,email, password } = this.miFormulario.value;//Extraer los valores del formulario

    this.authService.registro(name, email, password) // Llamar al método 'registro' del servicio de autenticación (AuthService)
      .subscribe(ok => { 

        console.log(ok)
        if (ok === true) { // Si el registro es exitoso, redirigir al usuario a la página de dashboard
          this.router.navigateByUrl('/dashboard')
          // Si hay un error, mostrar un mensaje de error utilizando la librería Swal
        } else { 
          Swal.fire('Error', ok, 'error')
        }
        
    })
    
    //this.router.navigateByUrl('/dashboard')
    

  }
}
