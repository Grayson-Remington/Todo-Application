package com.grayremington.authenticatedbackend.services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.grayremington.authenticatedbackend.models.Role;
import com.grayremington.authenticatedbackend.repository.UserRepository;
import com.grayremington.authenticatedbackend.models.ApplicationUser;

@Service
public class UserService implements UserDetailsService{

  @Autowired
  private PasswordEncoder encoder;

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    System.out.println("In the user details service");

    return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("user is not valid"));

  }
  
}