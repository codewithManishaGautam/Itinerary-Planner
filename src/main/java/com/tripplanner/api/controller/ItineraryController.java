package com.tripplanner.api.controller;

import com.tripplanner.api.dto.GenerateItineraryRequest;
import com.tripplanner.api.dto.ItineraryResponse;
import com.tripplanner.api.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ItineraryController {

    @Autowired
    private ItineraryService itineraryService;

    @PostMapping("/generate-itinerary")
    public ResponseEntity<?> generateItinerary(@Valid @RequestBody GenerateItineraryRequest request) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (userId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(error);
            }

            ItineraryResponse itinerary = itineraryService.generateItinerary(request);
            return ResponseEntity.ok(itinerary);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }
}
