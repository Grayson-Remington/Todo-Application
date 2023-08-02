package com.grayremington.authenticatedbackend.configuration;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class CorsConfig implements WebMvcConfigurer{
  @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all endpoints to accept cross-origin requests
            .allowedOrigins("*") // You can specify specific origins instead of "*" if needed
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
            .allowedHeaders("*") // You can specify specific headers if needed
            .allowCredentials(true) // Allow credentials like cookies (if applicable)
            .maxAge(3600); // Max age of pre-flight requests cache in seconds
    }
}
