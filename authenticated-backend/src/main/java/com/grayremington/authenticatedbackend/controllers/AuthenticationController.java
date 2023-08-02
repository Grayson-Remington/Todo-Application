package com.grayremington.authenticatedbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grayremington.authenticatedbackend.models.ApplicationUser;
import com.grayremington.authenticatedbackend.models.LoginResponseDTO;
import com.grayremington.authenticatedbackend.models.RegistrationDTO;
import com.grayremington.authenticatedbackend.services.AuthenticationService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")

public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

     @GetMapping("/hello")  
    public String helloAuthController(){
      return "Hello Auth";
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegistrationDTO body) {
    boolean userExists = authenticationService.checkIfUserExists(body.getUsername());
    if (userExists) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists.");
    } else {
        authenticationService.registerUser(body.getUsername(), body.getPassword());
        return ResponseEntity.ok("User registered successfully.");
    }
}

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody RegistrationDTO body, HttpServletResponse response){
       LoginResponseDTO loginResponse = authenticationService.loginUser(body.getUsername(), body.getPassword());

      return loginResponse;
    }

}
