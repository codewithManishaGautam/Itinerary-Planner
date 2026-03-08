package com.tripplanner.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;

@RestController
public class StaticController {

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping("/")
    public ResponseEntity<String> index() throws IOException {
        return serveHtmlFile("index.html");
    }

    @GetMapping("/index.html")
    public ResponseEntity<String> indexHtml() throws IOException {
        return serveHtmlFile("index.html");
    }

    @GetMapping("/login.html")
    public ResponseEntity<String> login() throws IOException {
        return serveHtmlFile("login.html");
    }

    @GetMapping("/signup.html")
    public ResponseEntity<String> signup() throws IOException {
        return serveHtmlFile("signup.html");
    }

    @GetMapping("/dashboard.html")
    public ResponseEntity<String> dashboard() throws IOException {
        return serveHtmlFile("dashboard.html");
    }

    private ResponseEntity<String> serveHtmlFile(String filename) throws IOException {
        try {
            Resource resource = resourceLoader.getResource("classpath:static/" + filename);
            if (resource.exists()) {
                String content = new String(Files.readAllBytes(resource.getFile().toPath()));
                return ResponseEntity
                        .ok()
                        .contentType(MediaType.TEXT_HTML)
                        .body(content);
            }
        } catch (Exception e) {
            // File not found
        }
        return ResponseEntity.notFound().build();
    }
}
