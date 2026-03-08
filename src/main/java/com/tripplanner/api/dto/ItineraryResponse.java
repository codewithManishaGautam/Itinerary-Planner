package com.tripplanner.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryResponse {
    private String destination;
    private String duration;
    private String budget;
    private String travellers;
    private Map<String, Object> coordinates;
    private List<Map<String, Object>> plan;
    private List<Map<String, String>> hotels;
    private List<Map<String, String>> flights;
    private List<Map<String, String>> railways;
    private List<Map<String, String>> places;
}
