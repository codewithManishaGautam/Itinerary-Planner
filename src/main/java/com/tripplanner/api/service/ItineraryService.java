package com.tripplanner.api.service;

import com.tripplanner.api.dto.GenerateItineraryRequest;
import com.tripplanner.api.dto.ItineraryResponse;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ItineraryService {

    private final Map<String, Map<String, Object>> destinationData = initializeDestinationData();

    public ItineraryResponse generateItinerary(GenerateItineraryRequest request) throws Exception {
        String destination = request.getDestination();
        String startDate = request.getStartDate();
        String endDate = request.getEndDate();
        String budget = request.getBudget();
        String travellers = request.getTravellers();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date start = sdf.parse(startDate);
        Date end = sdf.parse(endDate);
        long diffTime = Math.abs(end.getTime() - start.getTime());
        long days = (diffTime / (1000 * 60 * 60 * 24)) + 1;

        String destKey = destination.toLowerCase();
        Map<String, Object> destInfo = destinationData.getOrDefault(destKey, getDefaultDestination());

        @SuppressWarnings("unchecked")
        List<String> places = (List<String>) destInfo.get("places");
        Double lat = (Double) destInfo.get("lat");
        Double lon = (Double) destInfo.get("lon");

        List<Map<String, Object>> plan = generateDayWisePlan(destination, Math.min(days, 5), places);
        List<Map<String, String>> hotels = generateHotels(destination, budget);
        List<Map<String, String>> flights = generateFlights(budget);
        List<Map<String, String>> railways = generateRailways();
        List<Map<String, String>> placesList = generatePlaces(destination, places);

        ItineraryResponse response = new ItineraryResponse();
        response.setDestination(destination);
        response.setDuration(startDate + " to " + endDate);
        response.setBudget(budget);
        response.setTravellers(travellers);
        response.setCoordinates(Map.of("lat", lat, "lon", lon));
        response.setPlan(plan);
        response.setHotels(hotels);
        response.setFlights(flights);
        response.setRailways(railways);
        response.setPlaces(placesList);

        return response;
    }

    private List<Map<String, Object>> generateDayWisePlan(String destination, long days, List<String> places) {
        List<Map<String, Object>> plan = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            Map<String, Object> dayPlan = new LinkedHashMap<>();
            dayPlan.put("day", i + 1);

            String title;
            if (i == 0) {
                title = "Arrival & Exploration";
            } else if (i == days - 1) {
                title = "Departure Day";
            } else {
                title = "Day " + (i + 1) + " Adventure";
            }
            dayPlan.put("title", title);

            List<String> activities = new ArrayList<>();
            if (i == 0) {
                activities.add("Arrive at " + destination + " Airport/Station");
            } else {
                activities.add("Morning breakfast at hotel");
            }

            String place1 = places.get(i % places.size());
            activities.add("Visit " + place1);

            String place2 = places.get((i + 1) % places.size());
            if (!place2.equals(place1)) {
                activities.add("Explore " + place2);
            } else {
                activities.add("Local market exploration");
            }

            if (i == days - 1) {
                activities.add("Pack and depart");
            } else {
                activities.add("Evening leisure time");
            }

            dayPlan.put("activities", activities);
            plan.add(dayPlan);
        }

        return plan;
    }

    private List<Map<String, String>> generateHotels(String destination, String budget) {
        List<Map<String, String>> hotels = new ArrayList<>();

        String price1, price2;
        if ("luxury".equals(budget)) {
            price1 = "$250/night";
            price2 = "$180/night";
        } else if ("moderate".equals(budget)) {
            price1 = "$120/night";
            price2 = "$90/night";
        } else {
            price1 = "$60/night";
            price2 = "$45/night";
        }

        Map<String, String> hotel1 = new LinkedHashMap<>();
        hotel1.put("name", destination + " Grand Hotel");
        hotel1.put("rating", "4.5 stars");
        hotel1.put("price", price1);
        hotel1.put("image", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500");
        hotels.add(hotel1);

        Map<String, String> hotel2 = new LinkedHashMap<>();
        hotel2.put("name", destination + " City Inn");
        hotel2.put("rating", "4.0 stars");
        hotel2.put("price", price2);
        hotel2.put("image", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500");
        hotels.add(hotel2);

        return hotels;
    }

    private List<Map<String, String>> generateFlights(String budget) {
        List<Map<String, String>> flights = new ArrayList<>();

        String price1, price2;
        if ("luxury".equals(budget)) {
            price1 = "$450";
            price2 = "$380";
        } else {
            price1 = "$280";
            price2 = "$220";
        }

        Map<String, String> flight1 = new LinkedHashMap<>();
        flight1.put("airline", "AirTravel Express");
        flight1.put("price", price1);
        flight1.put("duration", "4h 30m");
        flights.add(flight1);

        Map<String, String> flight2 = new LinkedHashMap<>();
        flight2.put("airline", "SkyHigh Airlines");
        flight2.put("price", price2);
        flight2.put("duration", "5h 15m");
        flights.add(flight2);

        return flights;
    }

    private List<Map<String, String>> generateRailways() {
        List<Map<String, String>> railways = new ArrayList<>();

        Map<String, String> train1 = new LinkedHashMap<>();
        train1.put("train", "Express Rail");
        train1.put("price", "$80");
        train1.put("duration", "6h");
        railways.add(train1);

        Map<String, String> train2 = new LinkedHashMap<>();
        train2.put("train", "Super Fast");
        train2.put("price", "$120");
        train2.put("duration", "4h 30m");
        railways.add(train2);

        return railways;
    }

    private List<Map<String, String>> generatePlaces(String destination, List<String> places) {
        List<Map<String, String>> placesList = new ArrayList<>();
        for (int i = 0; i < places.size(); i++) {
            Map<String, String> place = new LinkedHashMap<>();
            place.put("name", places.get(i));
            place.put("description", "Famous attraction in " + destination);
            place.put("image", "https://images.unsplash.com/photo-" + (1500000000000L + i * 100000L) + "?w=400");
            placesList.add(place);
        }
        return placesList;
    }

    private Map<String, Map<String, Object>> initializeDestinationData() {
        Map<String, Map<String, Object>> data = new HashMap<>();

        data.put("paris", createDestinationData(
            Arrays.asList("Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"),
            48.8566, 2.3522));
        data.put("tokyo", createDestinationData(
            Arrays.asList("Tokyo Tower", "Shibuya Crossing", "Senso-ji Temple", "Meiji Shrine", "Akihabara"),
            35.6762, 139.6503));
        data.put("new york", createDestinationData(
            Arrays.asList("Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Brooklyn Bridge"),
            40.7128, -74.0060));
        data.put("london", createDestinationData(
            Arrays.asList("Big Ben", "Tower of London", "Buckingham Palace", "London Eye", "British Museum"),
            51.5074, -0.1278));
        data.put("dubai", createDestinationData(
            Arrays.asList("Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Marina", "Gold Souk"),
            25.2048, 55.2708));
        data.put("goa", createDestinationData(
            Arrays.asList("Baga Beach", "Calangute Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls"),
            15.2993, 74.1240));
        data.put("manali", createDestinationData(
            Arrays.asList("Solang Valley", "Rohtang Pass", "Hadimba Temple", "Old Manali", "Manu Temple"),
            32.2396, 77.1887));

        return data;
    }

    private Map<String, Object> createDestinationData(List<String> places, Double lat, Double lon) {
        Map<String, Object> data = new HashMap<>();
        data.put("places", places);
        data.put("lat", lat);
        data.put("lon", lon);
        return data;
    }

    private Map<String, Object> getDefaultDestination() {
        Map<String, Object> data = new HashMap<>();
        data.put("places", Arrays.asList("City Center", "Local Museum", "Main Park", "Historic District", "Market Area"));
        data.put("lat", 48.8566);
        data.put("lon", 2.3522);
        return data;
    }
}
