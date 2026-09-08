package com.gopalkundu.leettracker.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HeatlthController {
@GetMapping("/")
    public String healthCheck(){
        return "Backend is Live";
    }
    
}