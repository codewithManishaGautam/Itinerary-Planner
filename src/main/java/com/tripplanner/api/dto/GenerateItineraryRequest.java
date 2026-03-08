package com.tripplanner.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateItineraryRequest {
    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;

    @NotBlank(message = "Budget is required")
    private String budget;

    @NotBlank(message = "Number of travelers is required")
    private String travellers;
}
