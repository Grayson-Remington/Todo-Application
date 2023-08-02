package com.grayremington.authenticatedbackend;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.grayremington.authenticatedbackend.configuration.CorsConfig;
import com.grayremington.authenticatedbackend.models.ApplicationUser;
import com.grayremington.authenticatedbackend.models.Role;
import com.grayremington.authenticatedbackend.repository.RoleRepository;
import com.grayremington.authenticatedbackend.repository.UserRepository;

@SpringBootApplication
public class AuthenticatedBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthenticatedBackendApplication.class, args);
	}

@Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("*"); // Allow all origins, you may want to configure this accordingly
        config.addAllowedMethod("*"); // Allow all HTTP methods
        config.addAllowedHeader("*"); // Allow all headers
        config.setAllowCredentials(false); // Allow credentials like cookies (if applicable)
        config.setMaxAge(3600L); // Max age of pre-flight requests cache in seconds
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder){
		return args ->{
			if(roleRepository.findByAuthority("ADMIN").isPresent()) return;
			Role adminRole = roleRepository.save(new Role("ADMIN"));
			roleRepository.save(new Role("USER"));

			Set<Role> roles = new HashSet<>();

			roles.add(adminRole);

			ApplicationUser admin = new ApplicationUser(1, "admin", passwordEncoder.encode("password"), roles);

			userRepository.save(admin);
		};
	}
}
