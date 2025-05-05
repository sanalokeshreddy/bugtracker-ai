package com.devsage.bugtracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public Map<String, String> predictSeverity(String description) {
        Map<String, String> result = new HashMap<>();

        try {
            // Setup the Gemini prompt
            String prompt = """
                Classify the severity of this bug as one of: LOW, MEDIUM, HIGH, CRITICAL.
                Return the severity first (in bold like **HIGH**), then explain why.

                Bug Description:
                %s
                """.formatted(description);

            // Build request body
            String jsonBody = """
            {
              "contents": [{
                "parts": [{
                  "text": "%s"
                }]
              }]
            }
            """.formatted(prompt);

            // Prepare HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "?key=" + apiKey))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Log Gemini response
            System.out.println("Gemini raw response: " + response.body());

            // Parse JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            String fullResponse = textNode.asText();

            // Default values
            String severity = "UNKNOWN";
            String reasoning = fullResponse;

            // Try to extract **SEVERITY**
            int start = fullResponse.indexOf("**");
            int end = fullResponse.indexOf("**", start + 2);

            if (start != -1 && end != -1) {
                severity = fullResponse.substring(start + 2, end).trim().toUpperCase();
                reasoning = fullResponse.substring(end + 2).trim();
            }

            // Store result
            result.put("predictedSeverity", severity);
            result.put("reasoning", reasoning);

        } catch (Exception e) {
            e.printStackTrace();
            result.put("predictedSeverity", "ERROR");
            result.put("reasoning", "Gemini API failed or response was unreadable: " + e.getMessage());
        }

        return result;
    }
}
