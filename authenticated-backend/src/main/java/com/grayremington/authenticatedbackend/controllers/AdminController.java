package com.grayremington.authenticatedbackend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")

public class AdminController {
  
    @GetMapping("/")  
    public String helloAdminController(){
      return "Admin level access";
    }
}
