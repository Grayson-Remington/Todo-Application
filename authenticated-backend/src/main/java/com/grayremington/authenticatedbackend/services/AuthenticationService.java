package com.grayremington.authenticatedbackend.services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grayremington.authenticatedbackend.models.ApplicationUser;
import com.grayremington.authenticatedbackend.models.LoginResponseDTO;
import com.grayremington.authenticatedbackend.models.Role;
import com.grayremington.authenticatedbackend.repository.RoleRepository;
import com.grayremington.authenticatedbackend.repository.UserRepository;

@Service
@Transactional
public class AuthenticationService {


  @Autowired
  private UserRepository userRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private TokenService tokenService;

  public boolean checkIfUserExists(String username) {
    return userRepository.findByUsername(username).isPresent();
  }
    
  public ApplicationUser registerUser(String username, String password){
    
    String encodedPassword = passwordEncoder.encode(password);
    Role userRole = roleRepository.findByAuthority("USER").get();
    

    Set<Role> authorities = new HashSet<>();

    authorities.add(userRole);

    return userRepository.save(new ApplicationUser(0, username, encodedPassword, authorities));

  }

  public LoginResponseDTO loginUser(String username, String password){
      
      try {
        Authentication auth = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(username, password)
        );
        
        String token = tokenService.generateJwt(auth);

        return new LoginResponseDTO(userRepository.findByUsername(username).get(), token);


      } catch (AuthenticationException e) {
        return new LoginResponseDTO(null, "");
      }

  
    
  }

}
