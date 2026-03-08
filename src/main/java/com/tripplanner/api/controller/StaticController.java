package com.tripplanner.api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StaticController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/index.html")
    public String home() {
        return "forward:/index.html";
    }

    @GetMapping("/login.html")
    public String login() {
        return "forward:/login.html";
    }

    @GetMapping("/signup.html")
    public String signup() {
        return "forward:/signup.html";
    }

    @GetMapping("/dashboard.html")
    public String dashboard() {
        return "forward:/dashboard.html";
    }
}
